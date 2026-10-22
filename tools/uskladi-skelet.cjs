// Jedan skelet za ceo suite: zaglavlje <head> (tema, pisma, stil, skripta) i zaglavlje stranice
// (marka, navigacija, alat). Blokovi su omedjeni markerima, pa je pokretanje idempotentno.
// Zamenjuje raniji tools/uskladi-navigaciju.cjs. Provera je u tools/proveri-suite.cjs.
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '..');

// Radno stablo je CRLF (git autocrlf); obrada ide nad LF, zavrsetak reda se vraca pri upisu.
const CRLF = String.fromCharCode(13, 10), LF = String.fromCharCode(10);
const read = (f) => { const raw = fs.readFileSync(f, 'utf8'); return { text: raw.split(CRLF).join(LF), crlf: raw.includes(CRLF) }; };
const write = (f, t, crlf) => fs.writeFileSync(f, crlf ? t.split(LF).join(CRLF) : t);

const ORDER = [
  ['index.html', 'Pregled', 'Overview'],
  ['blizanac.html', 'Blizanac 3D', '3D twin'],
  ['mapa.html', 'Mapa', 'Map'],
  ['istrazivanje.html', 'Istraživanje', 'Research'],
  ['pokrivenost.html', 'Pokrivenost', 'Coverage'],
  ['registri.html', 'Registri', 'Registries'],
  ['izvori.html', 'Izvori', 'Sources'],
];
const JEZIK = ['index-en.html', 'EN'];   // poslednja stavka navigacije: jezicki par
const GITHUB = 'https://github.com/3esign/medijana';

const MARKA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6.4" y="6.4" width="9.6" height="9.6" fill="var(--d1)"/><rect x="16" y="16" width="9.6" height="9.6" fill="var(--d3)" opacity=".5"/><g fill="none" stroke="currentColor"><rect x="6.4" y="6.4" width="19.2" height="19.2" stroke-width="1.7"/><path d="M16 6.4v19.2M6.4 16h19.2" stroke-width="1" opacity=".45"/></g></svg>';
const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.1.7-.22.7-.49l-.01-1.9c-2.84.62-3.44-1.2-3.44-1.2-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.12 2.99.86.09-.66.36-1.12.65-1.37-2.27-.26-4.66-1.14-4.66-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.46-1.3.1-2.71 0 0 .86-.28 2.81 1.05a9.7 9.7 0 0 1 5.12 0c1.95-1.33 2.81-1.05 2.81-1.05.56 1.41.21 2.45.1 2.71.66.72 1.05 1.63 1.05 2.75 0 3.93-2.39 4.8-4.67 5.05.37.32.69.94.69 1.9l-.01 2.82c0 .27.19.59.71.49A10.2 10.2 0 0 0 12 1.8z"/></svg>';

const skelet = () => [
  '<!--skelet-->',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  `<script>try{var u=new URLSearchParams(location.search).get('tema'),t=u||localStorage.getItem('medijana-tema');document.documentElement.dataset.tema=t==='arhiv'||t==='teren'?t:(matchMedia('(prefers-color-scheme: light)').matches?'arhiv':'teren')}catch(e){document.documentElement.dataset.tema='teren'}</script>`,
  '<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>',
  '<link rel="preload" href="assets/fonts/sourceserif4-latin.woff2" as="font" type="font/woff2" crossorigin>',
  '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
  '<meta name="theme-color" content="#0c0c0b">',
  '<link rel="stylesheet" href="assets/medijana.css">',
  '<script src="assets/suite.js" defer></script>',
  '<!--/skelet-->',
].join('\n');

function zaglavlje(self) {
  const en = self === 'index-en.html';
  const tekst = en
    ? { skip: 'Skip to content', uz: 'digital twin', gh: 'Repository on GitHub', nav: 'Main navigation' }
    : { skip: 'Preskoči na sadržaj', uz: 'digitalni blizanac', gh: 'Repozitorijum na GitHubu', nav: 'Glavna navigacija' };
  const stavke = ORDER.map(([href, sr, eng]) =>
    `    <a href="${href}"${href === self ? ' aria-current="page"' : ''}>${en ? eng : sr}</a>`);
  // jezicki par je uvek poslednja stavka; na engleskom portalu je on sam tekuca strana
  stavke.push(`    <a href="${JEZIK[0]}" class="jezik"${JEZIK[0] === self ? ' aria-current="page"' : ''}>${JEZIK[1]}</a>`);
  return [
    '<!--hdr-->',
    `<a class="skip" href="#sadrzaj">${tekst.skip}</a>`,
    '<header class="hdr">',
    `  <a class="marka" href="${en ? 'index-en.html' : 'index.html'}">`,
    `    ${MARKA_SVG}`,
    `    <span class="ime">Medijana</span><span class="uz">${tekst.uz}</span>`,
    '  </a>',
    `  <nav id="glavna-navigacija" aria-label="${tekst.nav}">`,
    ...stavke,
    '  </nav>',
    '  <div class="hdr-alat">',
    `    <a class="dugme-ikona" href="${GITHUB}" title="${tekst.gh}" aria-label="${tekst.gh}">${GH_SVG}</a>`,
    '  </div>',
    '</header>',
    '<!--/hdr-->',
  ].join('\n');
}

const changed = [];
const files = [...ORDER.map(([f]) => f), JEZIK[0], '404.html'];
for (const file of files) {
  const full = path.join(root, file);
  const { text, crlf } = read(full);
  let html = text;
  const before = html;

  if (!/<!--skelet-->[\s\S]*?<!--\/skelet-->/.test(html)) throw Error(`${file}: nema <!--skelet--> blok`);
  if (!/<!--hdr-->[\s\S]*?<!--\/hdr-->/.test(html)) throw Error(`${file}: nema <!--hdr--> blok`);
  html = html.replace(/<!--skelet-->[\s\S]*?<!--\/skelet-->/, skelet());
  // 404 nije stavka navigacije: nosi isto zaglavlje, bez aria-current
  html = html.replace(/<!--hdr-->[\s\S]*?<!--\/hdr-->/, zaglavlje(file === '404.html' ? '' : file));

  if (html !== before) { write(full, html, crlf); changed.push(file); }
}
console.log(JSON.stringify({ skelet_synced: files.length, changed }));
