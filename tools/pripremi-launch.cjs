// Launch priprema: jedinstveni social/SEO meta blok i kanonski URL po stranici.
// Idempotentno — blok je omeđen markerima, pa ponovno pokretanje zamenjuje stari.
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '..');

// Fajlovi u radnom stablu su CRLF (git autocrlf); obrada ide nad LF, a zavrsetak
// reda se vraca pri upisu da izmena ne bude ceo fajl.
const CRLF = String.fromCharCode(13, 10), LF = String.fromCharCode(10);
const read = (f) => { const raw = fs.readFileSync(f, 'utf8'); return { text: raw.split(CRLF).join(LF), crlf: raw.includes(CRLF) }; };
const write = (f, t, crlf) => fs.writeFileSync(f, crlf ? t.split(LF).join(CRLF) : t);
const BASE = 'https://3esign.github.io/medijana';
const OG_IMAGE = BASE + '/assets/blizanac-render.png';
const SITE = 'Medijana · digitalni arheološki blizanac';

const pages = {
  'index.html': 'Digitalni arheološki blizanac kasnoantičkog carskog kompleksa Medijana (Naissus). Naučna forenzika, London Charter, HBIM/WebGPU.',
  'blizanac.html': 'Prva 3D radna maketa kompleksa Medijana, generisana uživo iz data/GEOMETRIJA.jsonl; boja prati poreklo mere, ne pretpostavljeni izgled.',
  'mapa.html': 'Šira mapa povezanih kasnoantičkih lokacija (Via Diagonalis, tetrarhijske rezidencije) i šematski raspored lokaliteta Medijana.',
  'istrazivanje.html': 'Radna sveska projekta Medijana: hipoteze M-H01–M-H10, otvorena pitanja i registar kontradikcija, sa planom provere za svaki zapis.',
  'pokrivenost.html': 'Kartoni geometrijskih elemenata Medijane: poreklo svake mere, bibliografska veza i konkretan sledeći korak ka pouzdanijoj geometriji.',
  'izvori.html': 'Anotirana bibliografija Medijane (1936–2026) i hronologija lokaliteta od Konstantinovog doba do tekućih kampanja.',
  'index-en.html': 'Digital archaeological twin and forensic spatial-material platform of the Late Antique imperial complex Mediana (Naissus). 90 years of excavations translated into open, verifiable 4D data.',
  'registri.html': 'Strojni registri projekta Medijana renderovani uživo iz data/*.jsonl — jedan izvor istine za stranice, 3D maketu i mapu.',
};

const OPEN = '<!--launch-meta-->', CLOSE = '<!--/launch-meta-->';
let changed = [];

for (const [file, desc] of Object.entries(pages)) {
  const full = path.join(root, file);
  const { text, crlf } = read(full);
  let html = text;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title) throw Error(`${file}: nema <title>`);

  const block = [
    OPEN,
    `<meta name="description" content="${desc}">`,
    `<link rel="canonical" href="${BASE}/${file === 'index.html' ? '' : file}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${SITE}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${desc}">`,
    `<meta property="og:url" content="${BASE}/${file === 'index.html' ? '' : file}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    `<meta property="og:image:alt" content="Render 3D radne makete kompleksa Medijana iz registra geometrije">`,
    file === 'index-en.html'
      ? `<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="sr_RS">`
      : `<meta property="og:locale" content="sr_RS">`,
    `<link rel="alternate" hreflang="${file === 'index-en.html' ? 'en' : 'sr'}" href="${BASE}/${file === 'index-en.html' ? 'index-en.html' : ''}">`,
    `<link rel="alternate" hreflang="${file === 'index-en.html' ? 'sr' : 'en'}" href="${BASE}/${file === 'index-en.html' ? '' : 'index-en.html'}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    CLOSE,
  ].join('\n');

  // skloni stari blok i sve samostalne description/canonical oznake
  html = html.replace(new RegExp(`${OPEN}[\\s\\S]*?${CLOSE}\\n?`), '');
  html = html.replace(/<meta name="description" content="[^"]*">\s*/g, '');
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '');
  html = html.replace(/(<title>[^<]*<\/title>)/, `$1\n${block}`);

  write(full, html, crlf);
  changed.push(file);
}
// Sitemap se izvodi iz istog spiska stranica, da ne moze da odluta od suite-a.
const PRIORITY = { 'index.html': '1.0', 'index-en.html': '0.9', 'blizanac.html': '0.9', 'mapa.html': '0.9' };
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(pages).map((file) => {
  const loc = `${BASE}/${file === 'index.html' ? '' : file}`;
  return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${PRIORITY[file] || '0.7'}</priority></url>`;
}).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

console.log(JSON.stringify({ meta_injected: changed.length, sitemap: Object.keys(pages).length, pages: changed }));
