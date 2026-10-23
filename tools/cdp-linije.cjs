/* CDP provera pokaznih linija: linija mora pratiti svoj natpis i tokom
   rotacije (damping) i posle smirenja; bez natpisa nema ni linije.
   Upotreba: node tools/cdp-linije.cjs [url] */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = process.argv[2] || 'http://localhost:8931/index.html';

/* meri stanje linija prema natpisima u pregledaču */
const MERENJE = `(function(){
  var k = document.querySelector('.scena'); if (!k) return 'nema scene';
  var kr = k.getBoundingClientRect();
  var svg = k.querySelector('.scena-linije');
  var vb = (svg.getAttribute('viewBox')||'0 0 1 1').split(' ');
  var sx = kr.width / parseFloat(vb[2]), sy = kr.height / parseFloat(vb[3]);
  var oznake = Array.prototype.filter.call(k.querySelectorAll('.scena-oznaka'),
    function(e){ return getComputedStyle(e).opacity !== '0' && !e.classList.contains('scena-oznaka-van'); })
    .map(function(e){ var r = e.getBoundingClientRect(); return { x0:r.left-kr.left-4, x1:r.right-kr.left+4, y0:r.top-kr.top-4, y1:r.bottom-kr.top+4 }; });
  var linije = Array.prototype.filter.call(svg.querySelectorAll('line'),
    function(l){ return l.style.display !== 'none'; })
    .map(function(l){ return { x2: parseFloat(l.getAttribute('x2'))*sx, y2: parseFloat(l.getAttribute('y2'))*sy }; });
  var sirocici = linije.filter(function(l){
    return !oznake.some(function(o){ return l.x2 >= o.x0 && l.x2 <= o.x1 && l.y2 >= o.y0 && l.y2 <= o.y1; });
  });
  return { natpisa: oznake.length, linija: linije.length, sirocici: sirocici.length, uPokretu: k.classList.contains('scena-u-pokretu') };
})()`;

async function main() {
  const port = 9333 + Math.floor(Math.random() * 300);
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'medijana-lin-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=' + port,
    '--user-data-dir=' + dir, '--no-first-run',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--window-size=1200,800', 'about:blank',
  ], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break; } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
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
  const proceni = async izraz => (await posalji('Runtime.evaluate', { expression: izraz, awaitPromise: true, returnByValue: true })).result?.value;
  await posalji('Page.enable'); await posalji('Runtime.enable');
  await posalji('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 7000));

  const rezultat = { url };
  rezultat.mir1 = await proceni(MERENJE);

  /* simulirana rotacija prevlačenjem preko platna */
  const c = await proceni(`(function(){ var r = document.querySelector('.scena canvas').getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; })()`);
  await posalji('Input.dispatchMouseEvent', { type: 'mousePressed', x: c.x, y: c.y, button: 'left', clickCount: 1 });
  for (let i = 1; i <= 12; i++) {
    await posalji('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x + i * 14, y: c.y - i * 5, button: 'left' });
    await new Promise(r => setTimeout(r, 24));
  }
  rezultat.tokomPrevlacenja = await proceni(MERENJE);
  await posalji('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c.x + 168, y: c.y - 60, button: 'left' });
  await new Promise(r => setTimeout(r, 150));
  rezultat.tokomDampinga = await proceni(MERENJE);
  /* headless swiftshader radi ~9 fps, a damping se gasi po frejmu:
     smirenje tamo traje višestruko duže nego na stvarnom uređaju */
  await new Promise(r => setTimeout(r, 8000));
  rezultat.posleSmirenja = await proceni(MERENJE);

  /* oznake isključene: ni jedna linija ne sme biti vidljiva */
  await proceni(`document.querySelector('[data-radnja="oznake"]').click()`);
  await new Promise(r => setTimeout(r, 700));
  rezultat.bezOznaka = await proceni(MERENJE);

  const procene = [rezultat.mir1, rezultat.tokomPrevlacenja, rezultat.tokomDampinga, rezultat.posleSmirenja];
  rezultat.prolaz = procene.every(s => s && s.sirocici === 0)
    && rezultat.bezOznaka && rezultat.bezOznaka.linija === 0
    && rezultat.posleSmirenja.uPokretu === false;
  console.log(JSON.stringify(rezultat, null, 1));
  ws.close(); chrome.kill();
  process.exit(rezultat.prolaz ? 0 : 1);
}
main().catch(e => { console.error('CDP GRESKA:', e.message); process.exit(1); });
