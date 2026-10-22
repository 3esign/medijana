// Provera suite-a pre objave: svaka stranica ima isti skelet, lokalne veze postoje,
// nijedna putanja ne vodi u privatni materijal, i svaka stranica je dostupna iz navigacije.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const BASE = 'https://3esign.github.io/medijana';

// 404.html nije deo suite-a (nema kanonski URL ni mesto u navigaciji) — proverava se zasebno.
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html') && f !== '404.html').sort();
assert.equal(pages.length, 8, `ocekivano 8 stranica, nadjeno ${pages.length}`);

const navLinks = {};
let checkedLinks = 0;

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const where = (m) => `${file}: ${m}`;

  // skelet
  const lang = file === 'index-en.html' ? 'en' : 'sr';
  assert(html.includes(`<html lang="${lang}">`), where(`nema lang="${lang}"`));
  // dvojezicni par: svaka stranica upucuje na drugu jezicku verziju
  for (const hl of ['sr', 'en']) assert(html.includes(`hreflang="${hl}"`), where(`nema hreflang="${hl}"`));
  assert(/name="viewport" content="width=device-width,initial-scale=1"/.test(html), where('nema viewport'));
  assert(/<title>[^<]+<\/title>/.test(html), where('nema title'));
  assert(/<meta charset="utf-8">/.test(html), where('nema charset'));

  // social/SEO blok iz tools/pripremi-launch.cjs
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'theme-color']) {
    assert(html.includes(tag), where(`nema ${tag}`));
  }
  assert.equal((html.match(/name="description"/g) || []).length, 1, where('description nije tacno jedan'));
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  assert.equal(canonical, `${BASE}/${file === 'index.html' ? '' : file}`, where(`pogresan canonical: ${canonical}`));
  assert(fs.existsSync(path.join(root, 'favicon.svg')), 'nema favicon.svg');

  // zajednicki skelet i zaglavlje: jedan sistem, ne stranica po stranica
  for (const marker of ['<!--skelet-->', '<!--/skelet-->', '<!--hdr-->', '<!--/hdr-->']) {
    assert(html.includes(marker), where(`nema ${marker} — pokreni tools/uskladi-skelet.cjs`));
  }
  assert(html.includes('<link rel="stylesheet" href="assets/medijana.css">'), where('ne ucitava assets/medijana.css'));
  assert(html.includes('<script src="assets/suite.js" defer></script>'), where('ne ucitava assets/suite.js'));
  assert(/<header class="hdr">/.test(html), where('nema zajednicko zaglavlje .hdr'));
  assert(html.includes('class="marka"'), where('zaglavlje bez marke'));
  assert(html.includes('class="skip"'), where('nema vezu za preskakanje na sadrzaj'));
  assert(html.includes('id="sadrzaj"'), where('nema cilj #sadrzaj za preskakanje'));
  // nijedna stranica ne sme da vrati staru zlatno-braon paletu
  assert(!/#16130e|#c9a24b|Georgia,/.test(html), where('zaostala stara paleta ili Georgia'));

  // pristupacnost navigacije
  const nav = (html.match(/<nav[\s\S]*?<\/nav>/) || [])[0];
  assert(nav, where('nema <nav>'));
  assert(nav.includes('aria-label='), where('nav bez aria-label'));
  assert.equal((nav.match(/aria-current="page"/g) || []).length, 1, where('nav nema tacno jedan aria-current'));
  const inNav = [...nav.matchAll(/href="([^"]+\.html)"/g)].map(m => m[1]);
  assert.deepEqual([...new Set(inNav)].sort(), pages, where(`nav ne pokriva sve stranice: ${inNav.join(', ')}`));
  navLinks[file] = inNav;
  // ista navigacija svuda — isti redosled, a ne samo isti skup
  assert.deepEqual(inNav, navLinks[pages[0]], where('redosled navigacije se razlikuje od prve stranice'));

  // sve lokalne veze i resursi stvarno postoje
  for (const m of html.matchAll(/(?:href|src)="(?!https?:|mailto:|data:|#)([^"#?]+)/g)) {
    const target = decodeURIComponent(m[1]);
    if (target.includes('${')) continue; // sablon u ugradjenoj skripti, ne staticna putanja
    assert(fs.existsSync(path.join(root, target)), where(`veza bez fajla: ${target}`));
    assert(!/(^|\/)(private|secrets)(\/|$)/.test(target), where(`veza ka privatnom materijalu: ${target}`));
    checkedLinks++;
  }
}

// infrastruktura objave
for (const f of ['.nojekyll', 'robots.txt', 'sitemap.xml', 'LICENSE', 'LICENSE-CONTENT', 'CITATION.cff', '404.html', '.zenodo.json']) {
  assert(fs.existsSync(path.join(root, f)), `nema ${f}`);
}
JSON.parse(fs.readFileSync(path.join(root, '.zenodo.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of pages) {
  assert(sitemap.includes(`${BASE}/${file === 'index.html' ? '' : file}<`), `sitemap ne sadrzi ${file}`);
}

// privatni materijal ostaje izvan objave
const ignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
assert(ignore.includes('docs/private/'), '.gitignore ne izuzima docs/private/');
for (const doc of fs.readdirSync(path.join(root, 'docs')).filter(f => f.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(root, 'docs', doc), 'utf8');
  // pregovaracka taktika i interne instrukcije ne idu u javni repo
  assert(!/Zlatno pravilo prvog kontakta/.test(text), `${doc}: pregovaracka taktika mora u docs/private/`);
  assert(!/Zlatno pravilo|Data Request Protocol/.test(text), `${doc}: neposlat predlog institucijama mora u docs/private/`);
}

// stranica greske: bez indeksiranja, ali sa punom navigacijom nazad u suite
const notFound = fs.readFileSync(path.join(root, '404.html'), 'utf8');
assert(/name="robots" content="noindex"/.test(notFound), '404.html mora biti noindex');
for (const file of pages) assert(notFound.includes(`href="${file}"`), `404.html ne vodi na ${file}`);

// Markdown u javnom delu: svaka relativna veza mora postojati i ne sme voditi u privatno.
let mdLinks = 0;
const mdFiles = ['README.md', 'LOG.md', ...fs.readdirSync(path.join(root, 'docs'))
  .filter(f => f.endsWith('.md')).map(f => path.join('docs', f))];
for (const md of mdFiles) {
  const dir = path.dirname(path.join(root, md));
  const text = fs.readFileSync(path.join(root, md), 'utf8');
  for (const m of text.matchAll(/\]\((?!https?:|mailto:|#)([^)#\s]+)/g)) {
    const target = decodeURIComponent(m[1]);
    assert(!/(^|\/)private(\/|$)/.test(target), `${md}: javna veza ka privatnom materijalu: ${target}`);
    assert(fs.existsSync(path.resolve(dir, target)), `${md}: veza bez fajla: ${target}`);
    mdLinks++;
  }
}

console.log(JSON.stringify({ pages: pages.length, localLinks: checkedLinks, mdLinks, navConsistent: true, publishInfra: 'ok' }));
