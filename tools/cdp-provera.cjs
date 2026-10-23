/* CDP provera za Medijana suite — pravo vreme, bez virtual-time artefakata.
   Upotreba: node tools/cdp-provera.cjs <url> [čekanje_ms] */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = process.argv[2] || 'http://localhost:8931/index.html';
const cekaj = parseInt(process.argv[3] || '5000', 10);
const sirina = parseInt(process.argv[4] || '1440', 10);
const visina = parseInt(process.argv[5] || '900', 10);
const izlaz = process.argv[6] || '';

async function main() {
  const port = 9333 + Math.floor(Math.random() * 300);
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'medijana-cdp-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=' + port,
    '--user-data-dir=' + dir, '--no-first-run',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    `--window-size=${sirina},${visina}`,
    'about:blank',
  ], { stdio: 'ignore' });
  const cekajPort = async () => {
    for (let i = 0; i < 60; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (r.ok) return;
      } catch {}
      await new Promise(r => setTimeout(r, 250));
    }
    throw new Error('CDP port se nije otvorio');
  };
  await cekajPort();
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const strana = list.find(t => t.type === 'page');
  const ws = new WebSocket(strana.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0; const cekaju = new Map();
  const posalji = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id; cekaju.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  ws.onmessage = m => {
    const d = JSON.parse(m.data);
    if (d.id && cekaju.has(d.id)) { const { res, rej } = cekaju.get(d.id); cekaju.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); }
  };
  const proceni = async (izraz, pokusajDostupan = false) => {
    const r = await posalji('Runtime.evaluate', { expression: izraz, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails && !pokusajDostupan) throw new Error(JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails));
    return r.result?.value;
  };

  await posalji('Page.enable'); await posalji('Runtime.enable');
  /* registruj hvatanje grešana pre nego što se bilo koji skript stranice pokrene */
  await posalji('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__err = ''; window.__con = '';
    window.addEventListener('error', e => { window.__err += e.message + ' | ' + (e.filename || '') + ':' + e.lineno + '\\n'; });
    window.addEventListener('unhandledrejection', e => { window.__err += 'promise: ' + (e.reason && e.reason.message || e.reason) + '\\n'; });
    const _ce = console.error, _cw = console.warn;
    console.error = (...a) => { window.__con += 'ERR: ' + a.map(x => String(x && x.message || x)).join(' ').slice(0, 400) + '\\n'; _ce(...a); };
    console.warn = (...a) => { window.__con += 'WRN: ' + a.map(x => String(x && x.message || x)).join(' ').slice(0, 250) + '\\n'; _cw(...a); };
  ` });
  await posalji('Emulation.setDeviceMetricsOverride', { width: sirina, height: visina, deviceScaleFactor: 1, mobile: false });
  await posalji('Network.setCacheDisabled', { cacheDisabled: true });
  await posalji('Page.navigate', { url });
  await new Promise(r => setTimeout(r, cekaj));

  const izvestaj = {
    url,
    rafRadi: await proceni(`new Promise(res => { const t = setTimeout(() => res('ne'), 2500); requestAnimationFrame(() => { clearTimeout(t); res('da'); }); })`).catch(() => 'greska'),
    kadar: await proceni('window.medijanaKadar ? JSON.stringify(window.medijanaKadar()) : null').catch(e => 'nema dijag: ' + e.message),
    greske: await proceni('window.__err || null').catch(() => null),
    konzola: await proceni('(window.__con || "").slice(0, 2500)').catch(() => null).catch(() => null),
    petljaGreska: await proceni('window.__loopErr || null').catch(() => null),
    frejmovi: await proceni('window.__frames != null ? window.__frames : null').catch(() => null),
    korenKlasa: await proceni('(document.getElementById("hero-scena") || document.getElementById("scena") || document.querySelector(".scena") || null) ? (document.getElementById("hero-scena") || document.getElementById("scena") || document.querySelector(".scena")).className : null').catch(() => null),
    platno: await proceni('(function(){ var k = document.getElementById("hero-scena") || document.getElementById("scena") || document.querySelector(".scena"); if(!k) return null; var c = k.querySelector("canvas"); return c ? (c.clientWidth + "x" + c.clientHeight + " render:" + (c.getContext("webgl2")||c.getContext("webgl") ? "da" : "ne")) : "nema canvasa: " + k.className; })()').catch(e => 'greska: ' + e.message),
    /* deterministička provera natpisa: pravougaonici vidljivih natpisa + sudari */
    natpisi: await proceni('(function(){ var k = document.getElementById("hero-scena") || document.getElementById("scena") || document.querySelector(".scena"); if(!k) return null; var kr = k.getBoundingClientRect(); var niz = Array.prototype.map.call(k.querySelectorAll(".scena-oznaka"), function(e){ var r = e.getBoundingClientRect(); var cs = getComputedStyle(e); return { t: e.textContent.trim().slice(0,44), x: Math.round(r.left-kr.left), y: Math.round(r.top-kr.top), w: Math.round(r.width), h: Math.round(r.height), vidljiv: cs.opacity !== "0" && !e.classList.contains("scena-oznaka-van"), van: r.left < kr.left+1 || r.right > kr.right-1 || r.top < kr.top+1 || r.bottom > kr.bottom-1 }; }); var v = niz.filter(function(a){return a.vidljiv;}); var sudari = []; for (var i=0;i<v.length;i++) for (var j=i+1;j<v.length;j++) { var a=v[i], b=v[j]; if (a.x < b.x+b.w && b.x < a.x+a.w && a.y < b.y+b.h && b.y < a.y+a.h) sudari.push(a.t.slice(0,18) + " × " + b.t.slice(0,18)); } return { vidljivo: v.length, sakriveno: niz.length - v.length, vanOkvira: v.filter(function(a){return a.van;}).map(function(a){return a.t;}), sudari: sudari, lista: v.map(function(a){return a.t + " @" + a.x + "," + a.y;}) }; })()').catch(e => 'greska: ' + e.message),
  };
  const slika = await posalji('Page.captureScreenshot', { format: 'png' });
  console.log(JSON.stringify(izvestaj, null, 1));
  if (izlaz) fs.writeFileSync(izlaz, Buffer.from(slika.data, 'base64'));
  else fs.writeFileSync(path.join(__dirname, '../../artifacts/redizajn/rd/cdp.png'), Buffer.from(slika.data, 'base64'));
  ws.close(); chrome.kill();
  process.exit(0);
}
main().catch(e => { console.error('CDP GRESKA:', e.message); process.exit(1); });
