// Jedan redosled navigacije na svih 8 stranica (7 srpskih + engleski portal), uz zadrzan stil svake.
// Pokretati posle dodavanja stranice; provera je u tools/proveri-suite.cjs.
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '..');

// Fajlovi u radnom stablu su CRLF (git autocrlf); obrada ide nad LF, a zavrsetak
// reda se vraca pri upisu da izmena ne bude ceo fajl.
const CRLF = String.fromCharCode(13, 10), LF = String.fromCharCode(10);
const read = (f) => { const raw = fs.readFileSync(f, 'utf8'); return { text: raw.split(CRLF).join(LF), crlf: raw.includes(CRLF) }; };
const write = (f, t, crlf) => fs.writeFileSync(f, crlf ? t.split(LF).join(CRLF) : t);

const ORDER = [
  ['index.html', 'Medijana'],
  ['blizanac.html', 'Blizanac 3D'],
  ['mapa.html', 'Mapa'],
  ['istrazivanje.html', 'Istraživanje'],
  ['pokrivenost.html', 'Pokrivenost'],
  ['registri.html', 'Registri'],
  ['izvori.html', 'Izvori'],
  ['index-en.html', 'English [EN]'],
];
// Engleski portal nosi iste stavke, ali sa engleskim natpisima.
const EN = { 'index.html': 'Medijana [SR]', 'blizanac.html': '3D Twin', 'mapa.html': 'Map', 'istrazivanje.html': 'Research', 'pokrivenost.html': 'Coverage', 'registri.html': 'Registries', 'izvori.html': 'Sources', 'index-en.html': 'English [EN]' };
const GITHUB = 'https://github.com/3esign/medijana';

const links = (self, indent = '  ') => ORDER
  .map(([href, label]) => `${indent}<a href="${href}"${href === self ? ' aria-current="page"' : ''}>${label}</a>`)
  .join('\n');

const changed = [];
for (const [file] of ORDER) {
  const full = path.join(root, file);
  const { text, crlf } = read(full);
  let html = text, before = html;

  if (/<nav class="suite">/.test(html)) {
    html = html.replace(
      /<nav class="suite">[\s\S]*?<\/nav>/,
      `<nav class="suite" aria-label="Glavna navigacija"><div class="wrap">\n${links(file)}\n  <a href="${GITHUB}">GitHub</a>\n</div></nav>`
    );
  } else if (/<nav aria-label="Glavna navigacija">/.test(html)) {
    // istrazivanje/pokrivenost: isti redosled, bez .wrap omotaca
    html = html.replace(
      /<nav aria-label="Glavna navigacija">[\s\S]*?<\/nav>/,
      `<nav aria-label="Glavna navigacija">\n${links(file)}\n  <a href="${GITHUB}">GitHub</a>\n</nav>`
    );
  } else if (file === 'blizanac.html') {
    // 3D prikaz: linkovi zive u HUD zaglavlju, pa im se daje semantika navigacije
    html = html.replace(
      /(<h1>3D radna maketa<\/h1>)\n[\s\S]*?(\n  <a href="data\/GEOMETRIJA\.jsonl">)/,
      `$1\n  <nav aria-label="Glavna navigacija">\n${links(file, '    ')}\n    <a href="${GITHUB}">GitHub</a>\n  </nav>$2`
    );
    if (!/<nav aria-label="Glavna navigacija">/.test(html)) throw Error('blizanac.html: HUD zaglavlje nije prepoznato');
  }

  if (html !== before) { write(full, html, crlf); changed.push(file); }
}
console.log(JSON.stringify({ nav_normalized: changed.length, pages: changed }));
