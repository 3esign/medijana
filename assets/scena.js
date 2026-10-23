/* Medijana — 3D pregledač bele makete, jedan modul za ceo suite.
   Koriste ga blizanac.html (puna stranica) i naslovna (prvi ekran, 100dvh).
   Sve boje dolaze iz CSS tokena stranice: papir, mastilo i dokazne boje.
   Poreklo svake mere nosi boja ivice, ne zapremina: maketa je bela,
   kao arhitektonski radni model na papiru. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBLICI, proveriZapis } from './scena/oblici.js';

const REC = {
  sr: {
    ceo: 'Ceo kompleks', osnova: 'Osnova', izaberi: 'Izaberi objekat…',
    rek: 'Rekonstrukcija', sac: 'Sačuvano stanje', oznake: 'Oznake', legenda: 'Legenda',
    /* kratka imena za usku traku na telefonu — isto znacenje, manje mesta */
    ceoK: 'Ceo', osnovaK: 'Osnova', rekK: 'Rekonstr.', sacK: 'Sačuvano', oznakeK: 'Oznake', legendaK: 'Legenda',
    legendaNaslov: 'Poštena maketa',
    lgPoreklo: 'Poreklo mere — ivica', lgGradja: 'Zapremina',
    p1: 'objavljena dimenzija', p2: 'iz objavljene površine', p3: 'šematski — čeka plan (P2)',
    k1: 'belo — rekonstruisana zapremina', k2: 'kamen — sačuvano zidanje', k3: 'duh — rekonstrukcija nad sačuvanim',
    legendaKraj: 'Klik na objekat otvara dokaz. Raster tla 20 m. Raspored je šematski, nije georeferenciran.',
    ucitavanje: 'učitavanje geometrije…', sacuvano: 'Sačuvano:', rekU: 'u maketi rekonstruisano:',
    vezane: 'Vezane hipoteze:', izvori: 'Izvori:', karton: 'karton', bibliografija: 'bibliografija',
    polozaj: 'položaj:', izvanPrikaza: 'Izvan prikaza zbog spornog identiteta:', vidiPokrivenost: 'Vidi Pokrivenost.',
    nijeUSceni1: 'nije u sceni: identitet je sporan, pa je element izvan prostornog prikaza.',
    nijeUSceni2: 'Otvori karton →', rezervna: '3D prikaz trenutno nije dostupan.',
    rezervna2: 'Objekti i dokazi dostupni su i bez 3D prikaza.', prekinut: '3D prikaz je prekinut. Osveži stranicu.',
    greska: 'Ne mogu da učitam data/GEOMETRIJA.jsonl — otvori stranicu preko HTTP servera ili GitHub Pages.',
  },
  en: {
    ceo: 'Whole complex', osnova: 'Plan', izaberi: 'Select an object…',
    rek: 'Reconstruction', sac: 'Preserved state', oznake: 'Labels', legenda: 'Key',
    ceoK: 'Whole', osnovaK: 'Plan', rekK: 'Recon.', sacK: 'Preserved', oznakeK: 'Labels', legendaK: 'Key',
    legendaNaslov: 'An honest model',
    lgPoreklo: 'Origin of measure — edge', lgGradja: 'Volume',
    p1: 'published dimension', p2: 'from a published area', p3: 'schematic — awaiting plans (P2)',
    k1: 'white — reconstructed volume', k2: 'stone — preserved masonry', k3: 'ghost — reconstruction over remains',
    legendaKraj: 'Click an object for its evidence. Ground grid 20 m. Layout is schematic, not georeferenced.',
    ucitavanje: 'loading geometry…', sacuvano: 'Preserved:', rekU: 'reconstructed in the model:',
    vezane: 'Linked hypotheses:', izvori: 'Sources:', karton: 'record card', bibliografija: 'bibliography',
    polozaj: 'position:', izvanPrikaza: 'Excluded from view due to disputed identity:', vidiPokrivenost: 'See Coverage.',
    nijeUSceni1: 'is not in the scene: its identity is disputed, so the element is excluded from the spatial view.',
    nijeUSceni2: 'Open record card →', rezervna: 'The 3D view is currently unavailable.',
    rezervna2: 'Objects and evidence remain available without 3D.', prekinut: 'The 3D view was interrupted. Reload the page.',
    greska: 'Cannot load data/GEOMETRIJA.jsonl — open the page over an HTTP server or GitHub Pages.',
  }
};

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function pokreniScenu(opcije = {}) {
  const koren = opcije.koren;
  const T = REC[opcije.jezik === 'en' ? 'en' : 'sr'];
  const punaStrana = !!opcije.punaStrana;
  /* ime elementa na jeziku stranice: registar nosi naziv i naziv_en */
  const ime = e => (opcije.jezik === 'en' && e.naziv_en) || e.naziv;
  const smanjeniPokret = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* slabiji uredjaji (mali ekran ili grub pokazivac): manje piksela, bez senki —
     to je glavni uzrok trzanja na telefonu, ne broj trouglova u maketi */
  const slabiji = matchMedia('(max-width: 860px), (pointer: coarse)').matches
    || (navigator.hardwareConcurrency || 8) <= 4;

  /* ---------- boje iz tokena stranice ---------- */
  const cssVar = (ime, pad) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(ime).trim();
    return v || pad;
  };
  const PAPIR = cssVar('--g0', '#f3f1ec');
  const TLO = cssVar('--g2', '#eceae3');
  /* THREE.Color ignoriše alfu pa upozorava: skini je sa rgba tokena */
  const MREZA = cssVar('--l2', 'rgba(23,22,20,.22)').replace(/,\s*[\d.]+\s*\)$/, ')');
  const BOJE_DOKAZA = {
    objavljena_dimenzija: cssVar('--d1', '#2f6b46'),
    izvedeno_iz_povrsine: cssVar('--d2', '#8a6111'),
    sematski: cssVar('--d3', '#a2492a'),
  };

  /* ---------- renderer, scena, kamera ---------- */
  const scena = new THREE.Scene();
  scena.background = new THREE.Color(PAPIR);
  /* blaga dubinska atmosfera: daleki krajevi makete tonu u papir */
  scena.fog = new THREE.Fog(new THREE.Color(PAPIR), 700, 3200);
  /* near 2 (ne 0.1): sa dalekom ravni na 4200 dubinska preciznost na ~500 m
     pada ispod centimetra, pa raster, ivice i senke na tlu ne trepere */
  const kamera = new THREE.PerspectiveCamera(50, 1, 2, 4200);
  const renderer = new THREE.WebGLRenderer({ antialias: !slabiji, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, slabiji ? 1.5 : 2));
  renderer.shadowMap.enabled = !slabiji;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  koren.appendChild(renderer.domElement);

  const kontrole = new OrbitControls(kamera, renderer.domElement);
  kontrole.maxPolarAngle = Math.PI / 2.05;
  kontrole.enableDamping = true;
  kontrole.dampingFactor = 0.08;
  kontrole.minDistance = 12;
  kontrole.maxDistance = 2600;

  /* svetlo ateljea: nebo, topla podloga i sunce; senke samo na jačim uređajima */
  scena.add(new THREE.HemisphereLight(0xffffff, 0xb8b2a4, 0.85));
  const sunce = new THREE.DirectionalLight(0xfff6e8, 1.45);
  sunce.position.set(-160, 240, 140);
  if (!slabiji) {
    sunce.castShadow = true;
    sunce.shadow.mapSize.set(2048, 2048);
    sunce.shadow.bias = -0.0006;
    Object.assign(sunce.shadow.camera, { left: -280, right: 280, top: 280, bottom: -280, far: 900 });
  }
  scena.add(sunce);

  /* ---------- bela maketa ---------- */
  /* dve građe, jedna konvencija arheoloških maketa:
     belo = rekonstruisana zapremina, kamen = stvarno sačuvano zidanje */
  const BELA = new THREE.Color('#f8f6f1');
  const KAMEN = new THREE.Color('#c8bfab');
  const materijal = (e, tip) => {
    const c = (tip === 'kamen' ? KAMEN : BELA).clone();
    if (BOJE_DOKAZA[e.pouzdanost]) c.lerp(new THREE.Color(BOJE_DOKAZA[e.pouzdanost]), tip === 'kamen' ? 0.07 : 0.10);
    const sematski = e.pouzdanost === 'sematski';
    return new THREE.MeshStandardMaterial({
      color: c, roughness: tip === 'kamen' ? 1 : 0.94, metalness: 0,
      transparent: sematski, opacity: sematski ? (tip === 'kamen' ? 0.7 : 0.55) : 1,
    });
  };
  const kutija = (x, y, z) => new THREE.BoxGeometry(x, y, z);

  /* kontaktna senka: meka mrlja pod objektom — radi i na uređajima bez pravih senki */
  const senkaTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const cx = c.getContext('2d');
    const gr = cx.createRadialGradient(64, 64, 8, 64, 64, 62);
    gr.addColorStop(0, 'rgba(40,36,30,0.30)'); gr.addColorStop(0.7, 'rgba(40,36,30,0.12)'); gr.addColorStop(1, 'rgba(40,36,30,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();

  /* v (varijanta): tip 'bela'|'kamen', ivice, senka, duh (samo isprekidane
     ivice rekonstruisane zapremine nad sačuvanim), skala (sokl viri 2%) */
  function oblik(e, h, v = {}) {
    const g = new THREE.Group(), m = materijal(e, v.tip), D = e.dim;
    const dodaj = (geo, px = 0, pz = 0, ry = 0, py = h / 2) => {
      const M = new THREE.Mesh(geo, m);
      M.position.set(px, py, pz); M.rotation.y = ry;
      if (!slabiji && !v.duh) M.castShadow = M.receiveShadow = true;
      g.add(M); return M;
    };
    const greske = proveriZapis(e);
    if (greske.length) console.warn(`GEOMETRIJA ${e.id}: ${greske.join('; ')}`);
    OBLICI[e.oblik]?.gradi({ THREE, dodaj, kutija, D, h, g, TLO, PAPIR, MREZA, slabiji });
    const boja = new THREE.Color(BOJE_DOKAZA[e.pouzdanost] || '#6c6a65');
    if (v.duh) {
      /* duh: zapremina postaje tanak isprekidan crtež, bez ispune —
         nad kamenim ostacima pokazuje šta je u maketi rekonstruisano */
      const lm = new THREE.LineDashedMaterial({ color: boja, dashSize: 1.5, gapSize: 1.1, transparent: true, opacity: 0.32 });
      for (const mesh of [...g.children]) {
        if (!mesh.isMesh) continue;
        const L = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), lm);
        L.position.copy(mesh.position); L.rotation.copy(mesh.rotation);
        L.computeLineDistances();
        g.add(L); g.remove(mesh); mesh.geometry.dispose();
      }
      m.dispose();
    }
    /* mrlja ispod svake građevine, iz lokalnog obima grupe */
    if (v.senka && e.oblik !== 'ravan' && g.children.length) {
      const box = new THREE.Box3().setFromObject(g);
      const sx = (box.max.x - box.min.x) * 1.35, sz = (box.max.z - box.min.z) * 1.35;
      const S = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz),
        new THREE.MeshBasicMaterial({ map: senkaTex, transparent: true, depthWrite: false, opacity: slabiji ? 0.9 : 0.55 }));
      S.rotation.x = -Math.PI / 2;
      S.position.set((box.min.x + box.max.x) / 2, 0.05, (box.min.z + box.max.z) / 2);
      S.renderOrder = -1; S.userData.senka = true;
      g.add(S);
    }
    /* građevine stoje mrvicu iznad podloge: koplanarna dna i ivice na y=0
       dubinski se bore sa tlom i trepere pri rotaciji */
    g.position.set(e.pos[0], e.tip === 'teren' ? 0 : 0.18, e.pos[1]);
    g.rotation.y = (e.rot_deg || 0) * Math.PI / 180;
    if (v.skala) g.scale.set(v.skala, 1, v.skala);
    /* ivica u boji dokaza: crtež na zapremini */
    if (v.ivice && !v.duh && !['kolonada_prsten', 'kolonada_dvoredna', 'cilindri_mreza'].includes(e.oblik)) {
      for (const mesh of [...g.children]) {
        if (!mesh.isMesh) continue;
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const lineMat = e.pouzdanost === 'sematski'
          ? new THREE.LineDashedMaterial({ color: boja, dashSize: 1.2, gapSize: 0.8, transparent: true, opacity: 0.85 })
          : new THREE.LineBasicMaterial({ color: boja, transparent: true, opacity: 0.95 });
        const lines = new THREE.LineSegments(edges, lineMat);
        lines.computeLineDistances(); mesh.add(lines);
      }
    }
    return g;
  }

  /* ---------- HUD ---------- */
  const hud = document.createElement('div');
  hud.className = 'scena-hud';
  hud.innerHTML = `
    <div class="scena-status" role="status">${esc(T.ucitavanje)}</div>
    <div class="scena-kontrole">
      <div class="scena-red">
        <button type="button" data-radnja="kadar"><span class="dugo">${esc(T.ceo)}</span><span class="kratko">${esc(T.ceoK)}</span></button>
        <button type="button" data-radnja="plan" aria-pressed="false"><span class="dugo">${esc(T.osnova)}</span><span class="kratko">${esc(T.osnovaK)}</span></button>
        <select class="scena-objekat" aria-label="${esc(T.izaberi)}"><option value="">${esc(T.izaberi)}</option></select>
      </div>
      <span class="scena-seg">
        <button type="button" data-radnja="rek" class="on"><span class="dugo">${esc(T.rek)}</span><span class="kratko">${esc(T.rekK)}</span></button>
        <button type="button" data-radnja="sac"><span class="dugo">${esc(T.sac)}</span><span class="kratko">${esc(T.sacK)}</span></button>
      </span>
      <button type="button" data-radnja="oznake" class="on"><span class="dugo">${esc(T.oznake)}</span><span class="kratko">${esc(T.oznakeK)}</span></button>
      <button type="button" data-radnja="legenda" aria-expanded="false" aria-controls="scena-legenda"><span class="dugo">${esc(T.legenda)}</span><span class="kratko">${esc(T.legendaK)}</span></button>
      ${punaStrana ? '<a class="scena-glb" href="modeli/medijana.glb" download>GLB</a>' : ''}
    </div>
    <aside class="scena-legenda" id="scena-legenda" hidden>
      <h2>${esc(T.legendaNaslov)}</h2>
      <div class="scena-leg-kolone">
        <div>
          <div class="scena-leg-grupa">${esc(T.lgPoreklo)}</div>
          <div class="scena-stavka"><span class="scena-uz scena-u1"></span>${esc(T.p1)}</div>
          <div class="scena-stavka"><span class="scena-uz scena-u2"></span>${esc(T.p2)}</div>
          <div class="scena-stavka"><span class="scena-uz scena-u3"></span>${esc(T.p3)}</div>
        </div>
        <div>
          <div class="scena-leg-grupa">${esc(T.lgGradja)}</div>
          <div class="scena-stavka"><span class="scena-uz scena-ub"></span>${esc(T.k1)}</div>
          <div class="scena-stavka"><span class="scena-uz scena-uk"></span>${esc(T.k2)}</div>
          <div class="scena-stavka"><span class="scena-uz scena-ud"></span>${esc(T.k3)}</div>
        </div>
      </div>
      <div class="scena-legenda-kraj">${esc(T.legendaKraj)} <a class="veza" href="data/GEOMETRIJA.jsonl">GEOMETRIJA.jsonl</a></div>
    </aside>
    <div class="scena-info" hidden></div>
    <svg class="scena-linije" aria-hidden="true"></svg>`;
  koren.appendChild(hud);
  const q = s => koren.querySelector(s);
  const statusEl = q('.scena-status'), kontroleEl = q('.scena-kontrole'),
    legendaEl = q('.scena-legenda'), infoEl = q('.scena-info'),
    objekatSelect = q('.scena-objekat'), linijeEl = q('.scena-linije');

  function prikaziRezervnu(poruka) {
    if (koren.querySelector('.scena-rezervna')) return;
    koren.querySelector('.scena-poster')?.remove();
    const r = document.createElement('div');
    r.className = 'scena-rezervna';
    r.innerHTML = `<img src="assets/blizanac-render.png" alt="">
      <p>${esc(poruka)} <a class="veza" href="pokrivenost.html">${esc(T.rezervna2)}</a></p>`;
    koren.appendChild(r);
  }
  setTimeout(() => { if (!koren.classList.contains('scena-spremna')) prikaziRezervnu(T.rezervna); }, 12000);

  /* ---------- podaci ---------- */
  let elementi = [], hipoteze = {}, grupe = [], rezim = 'rek', oznakeOn = true, oznake = [];
  async function jsonl(p) {
    const t = await (await fetch(p)).text();
    return t.split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
  }

  function sagradi() {
    const materijali = new Set(), geometrije = new Set();
    grupe.forEach(g => {
      g.obj.traverse(o => {
        if (o.geometry) geometrije.add(o.geometry);
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => materijali.add(m));
      });
      scena.remove(g.obj);
    });
    geometrije.forEach(g => g.dispose()); materijali.forEach(m => m.dispose()); grupe = [];
    oznake.forEach(o => { o.el.remove(); o.linija.remove(); }); oznake = [];
    for (const e of elementi) {
      const teren = e.tip === 'teren';
      const hRek = Math.max(e.visina_rek_m || 0, 0.05), hSac = Math.max(e.visina_sacuvana_m || 0, 0.05);
      const h = teren ? 0 : (rezim === 'rek' ? hRek : hSac);
      const obj = oblik(e, h, { tip: rezim === 'sac' && !teren ? 'kamen' : 'bela', ivice: !teren, senka: !teren });
      obj.traverse(o => { o.userData.el = e; });
      scena.add(obj); grupe.push({ obj, el: e });
      /* oblici kojima gradi() ne sluša h (dolije) nemaju šta da dele na slojeve */
      const slojevito = !teren && hRek - hSac > 0.3 && e.oblik !== 'cilindri_mreza';
      if (slojevito && rezim === 'rek' && e.pouzdanost !== 'sematski' && e.visina_sacuvana_m > 0.2) {
        /* kameni sokl: stvarno sačuvana visina viri 2% iz bele zapremine */
        const sokl = oblik(e, hSac, { tip: 'kamen', skala: 1.02 });
        sokl.traverse(o => { o.userData.el = e; });
        scena.add(sokl); grupe.push({ obj: sokl, el: e });
      }
      if (slojevito && rezim === 'sac') {
        /* duh rekonstruisane zapremine nad ostacima; bez userData.el,
           pa klik prolazi kroz njega do stvarnih zapremina */
        const duh = oblik(e, hRek, { duh: true });
        scena.add(duh); grupe.push({ obj: duh, el: e });
      }
      if (!teren) {
        const d = document.createElement('div');
        d.className = 'scena-oznaka'; d.textContent = ime(e);
        koren.appendChild(d);
        /* svaka oznaka nosi i svoju pokaznu liniju: zajedno se pomeraju i kriju */
        const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        linijeEl.appendChild(ln);
        oznake.push({ el: d, linija: ln, trebaLinija: false, wL: 120, hL: 20, e, pos: new THREE.Vector3(e.pos[0], h + 3, e.pos[1]), ax: 0, ay: 0, dx: 0, dy: 0, postavljena: false });
      }
    }
    prljaviNatpisi = true;
  }

  /* ---------- sigurni pravougaonik (prostor bez HUD-a i naslova) ---------- */
  const izuzeti = (opcije.izuzmi || []).map(s => document.querySelector(s)).filter(Boolean);
  function prozor() {
    const w = koren.clientWidth, h = koren.clientHeight, c = koren.getBoundingClientRect();
    const gore = koren.classList.contains('scena-pod-zaglavljem')
      ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--h-hdr')) || 58 : 0;
    const status = statusEl.getBoundingClientRect(), dole = kontroleEl.getBoundingClientRect();
    let x0 = 0.03 * w, x1 = 0.97 * w;
    let y0 = Math.max(gore + 10, status.bottom - c.top + 14);
    let y1 = dole.top - c.top - 18;
    if (!infoEl.hidden && w > 860) x1 = Math.min(x1, infoEl.getBoundingClientRect().left - c.left - 18);
    if (!legendaEl.hidden && w > 860) y1 = Math.min(y1, legendaEl.getBoundingClientRect().top - c.top - 14);
    for (const iz of izuzeti) {
      const r = iz.getBoundingClientRect();
      if (r.width < 2 || r.bottom < c.top + 4) continue;
      if (r.right - c.left < 0.55 * w) x0 = Math.max(x0, r.right - c.left + 22);  // naslov levo: model desno
      else y0 = Math.max(y0, r.bottom - c.top + 18);                              // naslov svuda: model ispod
    }
    return { x0, x1, y0, y1: Math.max(y1, y0 + h * 0.3) };
  }

  /* ---------- natpisi: raspored samo kad se kamera smiri ---------- */
  let trazeniKadar = null, korisnikPomerio = false, prljaviNatpisi = true;
  let poslednjiPoremecaj = -1, trenutniTren = 0;   /* sat petlje (rAF), jedan za sve */
  /* font-display:swap — širina čipa se menja kad webfont zameni fallback,
     pa raspored natpisa mora ponovo da se izračuna po učitavanju fonta */
  if (document.fonts?.ready) document.fonts.ready.then(() => { prljaviNatpisi = true; });

  /* sudar pravougaonika zadatih centrom, sa malom marginom */
  const sudar = (a, b) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 10 && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + 12;

  /* rang tipa: na malom platnu glavne građevine zadržavaju natpis,
     pod-elementi (trem, kolonada, instalacija) se prvi sklanjaju */
  const RANG_TIPA = { gradjevina: 0, instalacija: 1, kolonada: 2, trem: 3 };

  function rasporediOznake() {
    const w = koren.clientWidth, h = koren.clientHeight, sig = prozor();
    const kandidati = oznake.map(o => {
      const v = o.pos.clone().project(kamera);
      return { o, v, ax: (v.x + 1) / 2 * w, ay: (-v.y + 1) / 2 * h };
    }).filter(k => k.v.z < 1 && k.ax > -80 && k.ax < w + 80 && k.ay > -40 && k.ay < h + 40)
      .sort((a, b) => (b.o.e.id === trazeniKadar) - (a.o.e.id === trazeniKadar)
        || (RANG_TIPA[a.o.e.tip] ?? 9) - (RANG_TIPA[b.o.e.tip] ?? 9)
        || a.v.z - b.v.z);
    const postavljeni = [], smesteni = new Set();
    for (const k of kandidati) {
      const { o, ax, ay } = k;
      const wL = o.el.offsetWidth || 120, hL = o.el.offsetHeight || 20;
      /* redosled: iznad, ispod, desno, levo, dijagonalno — sa rastućim odmakom */
      const pokusaji = [];
      for (const d of [8, 18, 30, 44, 64, 88]) pokusaji.push(
        { x: ax - wL / 2, y: ay - hL - d }, { x: ax - wL / 2, y: ay + d },
        { x: ax + d, y: ay - hL / 2 }, { x: ax - wL - d, y: ay - hL / 2 },
        { x: ax - wL / 2 - d, y: ay - hL - d }, { x: ax - wL / 2 + d, y: ay - hL - d },
        { x: ax - wL / 2 - d, y: ay + d }, { x: ax - wL / 2 + d, y: ay + d });
      const uOkviru = p => p.x >= sig.x0 && p.x + wL <= sig.x1 && p.y >= sig.y0 && p.y + hL <= sig.y1;
      let p = pokusaji.find(p2 => uOkviru(p2) && !postavljeni.some(q => sudar({ x: p2.x + wL / 2, y: p2.y + hL / 2, w: wL, h: hL }, q)));
      /* kad nema mesta bez sudara, natpis se sklanja — jedino traženi objekat
         ostaje uvek, makar i najbliže gomili */
      if (!p) {
        if (o.e.id !== trazeniKadar) { o.postavljena = false; continue; }
        p = pokusaji[0];
      }
      /* sudar poredi centre: p.x/p.y su gornji-levi ugao kandidata */
      postavljeni.push({ x: p.x + wL / 2, y: p.y + hL / 2, w: wL, h: hL });
      o.ax = ax; o.ay = ay; o.wL = wL; o.hL = hL;
      o.dx = p.x + wL / 2 - ax; o.dy = p.y + hL / 2 - ay;
      o.postavljena = true;
      smesteni.add(o);
      /* pokazna linija samo kad je natpis stvarno pomeren sa objekta;
         krajeve joj svakog kadra računa pratiOznake, iz iste projekcije */
      o.trebaLinija = Math.hypot(o.dx, o.dy) > 16 + hL / 2;
    }
    for (const o of oznake) {
      o.el.classList.toggle('scena-oznaka-van', !smesteni.has(o));
    }
    linijeEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }

  /* između rasporeda natpisi i njihove linije prate projekciju svakog kadra,
     bez promene vidljivosti — ništa ne može da zaostane i "lebdi" */
  function pratiOznake() {
    const w = koren.clientWidth, h = koren.clientHeight;
    for (const o of oznake) {
      const aktivna = o.postavljena && oznakeOn && o.trebaLinija;
      o.linija.style.display = aktivna ? '' : 'none';
      if (!o.postavljena) continue;
      const v = o.pos.clone().project(kamera);
      const ax = (v.x + 1) / 2 * w, ay = (-v.y + 1) / 2 * h;
      const x = ax + o.dx, y = ay + o.dy;
      o.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;
      if (aktivna) {
        const px = Math.max(x - o.wL / 2, Math.min(ax, x + o.wL / 2));
        const py = ay < y ? y - o.hL / 2 : y + o.hL / 2;
        o.linija.setAttribute('x1', ax.toFixed(1)); o.linija.setAttribute('y1', ay.toFixed(1));
        o.linija.setAttribute('x2', px.toFixed(1)); o.linija.setAttribute('y2', py.toFixed(1));
      }
    }
  }

  /* ---------- kadriranje ---------- */
  const SMER = new THREE.Vector3(150, 160, 210).normalize();
  const ODGOZGO = new THREE.Vector3(0, 1, 0.0001).normalize();
  let pogledPlan = false, pomakKadra = { x: 0, y: 0 }, animacija = null;

  /* pomak kadra je čist pomak projekcije u pikselima (full == sub: bez zumiranja),
     pa (v.x + 1) / 2 * w ostaje validna veza NDC ↔ platno za natpise */
  function postaviProzor() {
    const w = koren.clientWidth, h = koren.clientHeight;
    kamera.setViewOffset(w, h, -pomakKadra.x * w, -pomakKadra.y * h, w, h);
    kamera.updateProjectionMatrix();
  }
  function tackeKadra() {
    const points = [];
    for (const g of grupe) {
      if (g.el.tip === 'teren' || (trazeniKadar && g.el.id !== trazeniKadar)) continue;
      g.obj.updateWorldMatrix(true, true);
      /* kontaktne senke ne ulaze u kadar: šire su od objekta;
         duh-linije ulaze, da rekonstruisana zapremina ne izlazi iz kadra */
      const box = new THREE.Box3();
      g.obj.traverse(o => { if ((o.isMesh || o.isLine) && !o.userData.senka) box.expandByObject(o); });
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z])
        points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }
  /* krajnji kadar: rešenje perspektivnih nejednakosti + centriranje stvarne projekcije */
  function krajnjiKadar() {
    const points = tackeKadra(); if (!points.length) return null;
    const o = prozor(), w = koren.clientWidth, h = koren.clientHeight;
    const c = new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
    const dir = pogledPlan ? ODGOZGO : SMER;
    const cuvajPoz = kamera.position.clone(), cuvajZoom = kamera.zoom,
      cuvajPomak = { ...pomakKadra }, cuvajCilj = kontrole.target.clone();
    pomakKadra = { x: 0, y: 0 }; kamera.zoom = 1;
    kamera.position.copy(c).add(dir); kamera.lookAt(c); kamera.updateMatrixWorld(true);
    const right = new THREE.Vector3().setFromMatrixColumn(kamera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(kamera.matrixWorld, 1);
    const tanY = Math.tan(THREE.MathUtils.degToRad(kamera.fov) / 2);
    const tanX = tanY * w * (o.x1 - o.x0) / (h * (o.y1 - o.y0));
    let distance = 1;
    for (const p of points) {
      const v = p.clone().sub(c), dubina = v.dot(dir);
      distance = Math.max(distance, dubina + Math.abs(v.dot(right)) / tanX, dubina + Math.abs(v.dot(up)) / tanY);
    }
    kamera.position.copy(c).addScaledVector(dir, distance * 1.09);
    kontrole.target.copy(c); postaviProzor(); kamera.updateMatrixWorld(true);
    const bounds = () => {
      const p = points.map(v => v.clone().project(kamera));
      return {
        x0: Math.min(...p.map(v => (v.x + 1) / 2)), x1: Math.max(...p.map(v => (v.x + 1) / 2)),
        y0: Math.min(...p.map(v => (1 - v.y) / 2)), y1: Math.max(...p.map(v => (1 - v.y) / 2)),
      };
    };
    let proj = bounds();
    /* prozor() je u pikselima, bounds() u delovima platna: svedi pre poredjenja */
    const sx = (o.x1 - o.x0) / w, sy = (o.y1 - o.y0) / h;
    kamera.zoom = 0.9 * Math.min(sx / (proj.x1 - proj.x0 || 1e-6), sy / (proj.y1 - proj.y0 || 1e-6));
    kamera.updateProjectionMatrix(); proj = bounds();
    const pomak = {
      x: (o.x0 + o.x1) / (2 * w) - (proj.x0 + proj.x1) / 2,
      y: (o.y0 + o.y1) / (2 * h) - (proj.y0 + proj.y1) / 2,
    };
    const kraj = { cilj: c.clone(), pozicija: kamera.position.clone(), zum: kamera.zoom, pomak };
    /* vrati stanje pošiljaocu: krajnji kadar se primenjuje animacijom ili direktno */
    kamera.position.copy(cuvajPoz); kamera.zoom = cuvajZoom; pomakKadra = cuvajPomak;
    kontrole.target.copy(cuvajCilj);
    return kraj;
  }
  function primeniKadar(k) {
    kontrole.target.copy(k.cilj); kamera.position.copy(k.pozicija); kamera.zoom = k.zum;
    pomakKadra = { ...k.pomak }; postaviProzor();
    const d = kontrole.enableDamping; kontrole.enableDamping = false; kontrole.update(); kontrole.enableDamping = d;
  }
  function uokviri(animiraj) {
    const k = krajnjiKadar(); if (!k) return;
    if (animiraj && koren.classList.contains('scena-spremna') && !smanjeniPokret && !korisnikPomerio)
      zapocniAnimaciju(k);
    else primeniKadar(k);
    prljaviNatpisi = true;
  }
  function zapocniAnimaciju(k, trajanje = 650) {
    animacija = {
      t0: null, trajanje,   /* sidro se postavlja iz petlje: isti sat kao rAF */
      odCilj: kontrole.target.clone(), doCilj: k.cilj.clone(),
      odPoz: kamera.position.clone(), doPoz: k.pozicija.clone(),
      odZum: kamera.zoom, doZum: k.zum,
      odPomak: { ...pomakKadra }, doPomak: { ...k.pomak },
    };
  }
  function korakAnimacije(sada) {
    if (!animacija) return false;
    if (animacija.t0 === null) animacija.t0 = sada;
    const t = Math.min(1, Math.max(0, (sada - animacija.t0) / animacija.trajanje));
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    kontrole.target.lerpVectors(animacija.odCilj, animacija.doCilj, e);
    kamera.position.lerpVectors(animacija.odPoz, animacija.doPoz, e);
    kamera.zoom = animacija.odZum + (animacija.doZum - animacija.odZum) * e;
    pomakKadra = {
      x: animacija.odPomak.x + (animacija.doPomak.x - animacija.odPomak.x) * e,
      y: animacija.odPomak.y + (animacija.doPomak.y - animacija.odPomak.y) * e,
    };
    postaviProzor(); kontrole.update();
    if (t >= 1) { animacija = null; prljaviNatpisi = true; }
    return true;
  }

  /* ---------- dosije objekta ---------- */
  const klasa = p => p === 'objavljena_dimenzija' ? 'd1' : p === 'izvedeno_iz_povrsine' ? 'd2' : p === 'sematski' ? 'd3' : 'dx';
  function pokazi(e) {
    const hip = (e.hipoteze || []).map(h2 => {
      const H = hipoteze[h2];
      return `<p><b>${esc(h2)}</b> — ${esc(H ? H.naslov : '')} <span class="znak d3">${esc(H ? H.status : '')}</span></p>`;
    }).join('');
    infoEl.innerHTML = `<button class="scena-x" type="button" aria-label="×">×</button>
      <span class="id">${esc(e.id)} · ${esc(e.nivo)}</span><h3>${esc(ime(e))}</h3>
      <span class="znak ${klasa(e.pouzdanost)}">${esc(e.pouzdanost.replace(/_/g, ' '))}</span>
      <span class="znak ${e.polozaj === 'sematski' ? 'd3' : 'gol'}">${esc(T.polozaj)} ${esc(e.polozaj)}</span>
      <p style="margin-top:10px">${esc(e.napomena)}</p>
      <p><b>${esc(T.sacuvano)}</b> ${e.visina_sacuvana_m} m · <b>${esc(T.rekU)}</b> ${e.visina_rek_m} m (šematski)</p>
      ${hip ? `<p><b>${esc(T.vezane)}</b></p>${hip}` : ''}
      <p><b>${esc(T.izvori)}</b> ${(e.izvori || []).map(esc).join(', ')} ·
        <a href="pokrivenost.html?q=${encodeURIComponent(e.id)}">${esc(T.karton)}</a> ·
        <a href="docs/04_BIBLIOGRAFIJA_I_IZVORI.md">${esc(T.bibliografija)}</a></p>`;
    infoEl.hidden = false;
    infoEl.querySelector('.scena-x').addEventListener('click', zatvoriDosije);
    objekatSelect.value = e.id; trazeniKadar = e.id; korisnikPomerio = false;
    legendaStanje(false); uokviri(true);
  }
  function zatvoriDosije() {
    infoEl.hidden = true; trazeniKadar = null; korisnikPomerio = false;
    objekatSelect.value = ''; uokviri(true);
  }

  /* ---------- interakcija ---------- */
  const ray = new THREE.Raycaster(), mis = new THREE.Vector2();
  let pocetakKlika = null;
  renderer.domElement.addEventListener('pointerdown', e => { pocetakKlika = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('click', e => {
    if (pocetakKlika && Math.hypot(e.clientX - pocetakKlika[0], e.clientY - pocetakKlika[1]) > 6) return;
    const r = koren.getBoundingClientRect();
    mis.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mis, kamera);
    const hit = ray.intersectObjects(scena.children, true).find(h2 => h2.object.userData.el && h2.object.userData.el.tip !== 'teren');
    if (hit) pokazi(hit.object.userData.el);
  });

  const dugme = radnja => kontroleEl.querySelector(`[data-radnja="${radnja}"]`);
  function legendaStanje(otvorena) {
    legendaEl.hidden = !otvorena;
    dugme('legenda').setAttribute('aria-expanded', String(otvorena));
  }
  dugme('legenda').addEventListener('click', () => { legendaStanje(legendaEl.hidden); prljaviNatpisi = true; });
  dugme('rek').addEventListener('click', () => {
    rezim = 'rek'; dugme('rek').classList.add('on'); dugme('sac').classList.remove('on');
    sagradi(); if (!korisnikPomerio) uokviri(true);
  });
  dugme('sac').addEventListener('click', () => {
    rezim = 'sac'; dugme('sac').classList.add('on'); dugme('rek').classList.remove('on');
    sagradi(); if (!korisnikPomerio) uokviri(true);
  });
  dugme('oznake').addEventListener('click', () => {
    oznakeOn = !oznakeOn; dugme('oznake').classList.toggle('on', oznakeOn);
    koren.classList.toggle('scena-bez-oznaka', !oznakeOn); prljaviNatpisi = true;
  });
  dugme('kadar').addEventListener('click', () => {
    trazeniKadar = null; korisnikPomerio = false; infoEl.hidden = true; objekatSelect.value = ''; uokviri(true);
  });
  dugme('plan').addEventListener('click', () => promeniPogled(!pogledPlan));
  objekatSelect.addEventListener('change', e2 => {
    const nadjeno = elementi.find(x => x.id === e2.target.value);
    if (nadjeno) pokazi(nadjeno); else dugme('kadar').click();
  });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (infoEl.hidden && legendaEl.hidden) return;
    zatvoriDosije(); legendaStanje(false);
  });
  function promeniPogled(plan) {
    pogledPlan = plan; korisnikPomerio = false;
    dugme('plan').setAttribute('aria-pressed', String(plan));
    dugme('plan').classList.toggle('on', plan);
    uokviri(true);
  }

  /* ---------- petlja: kontinuirano renderovanje, raspored po smirenju ---------- */
  kontrole.addEventListener('start', () => { korisnikPomerio = true; animacija = null; });
  /* damping posle puštanja prsta šalje change sa sve sitnijim pomacima:
     ispod praga ga ne računamo u poremećaj, da se natpisi smire odmah
     a ne tek kad damping matematički odumre */
  const zadnje = { poz: new THREE.Vector3(), cilj: new THREE.Vector3(), zum: 1 };
  kontrole.addEventListener('change', () => {
    const d = kamera.position.distanceTo(zadnje.poz)
      + kontrole.target.distanceTo(zadnje.cilj)
      + Math.abs(kamera.zoom - zadnje.zum) * 300;
    if (d < 0.25) return;
    zadnje.poz.copy(kamera.position); zadnje.cilj.copy(kontrole.target); zadnje.zum = kamera.zoom;
    poslednjiPoremecaj = trenutniTren;
  });
  function petlja(sada) {
    trenutniTren = sada;
    if (poslednjiPoremecaj < 0) poslednjiPoremecaj = sada;
    kontrole.update();
    const uAnimaciji = korakAnimacije(sada);
    if (uAnimaciji) poslednjiPoremecaj = sada;
    pratiOznake();
    const mirno = !uAnimaciji && sada - poslednjiPoremecaj > 380;
    /* svaki poremećaj (damping, animacija) markira prljavo: kad se kamera
       konačno smiri, raspored se ponavlja i natpisi se razmaknu */
    if (!mirno) prljaviNatpisi = true;
    if (mirno && prljaviNatpisi) { rasporediOznake(); pratiOznake(); prljaviNatpisi = false; }
    koren.classList.toggle('scena-u-pokretu', !mirno);
    renderer.render(scena, kamera);
    if (!document.hidden) requestAnimationFrame(petlja);
    else { petljaUPauzi = true; }
  }
  let petljaUPauzi = false;
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && petljaUPauzi) { petljaUPauzi = false; poslednjiPoremecaj = -1; requestAnimationFrame(petlja); }
  });

  function uskladiVelicinu() {
    const w = koren.clientWidth, h = koren.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    linijeEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
    kamera.aspect = w / h; kamera.updateProjectionMatrix();
    if (korisnikPomerio) postaviProzor(); else uokviri(false);
  }
  new ResizeObserver(uskladiVelicinu).observe(koren);
  /* kad se web-fontovi učitaju, širine natpisa se menjaju — raspored ponovo */
  document.fonts?.ready.then(() => { prljaviNatpisi = true; });

  /* ---------- dijagnostika za provere (samo uz dijag: true) ---------- */
  if (opcije.dijag) {
    window.medijanaKadar = () => {
      kamera.updateMatrixWorld(true);
      const pts = tackeKadra().map(p => p.project(kamera));
      return {
        camera: kamera.position.toArray(), zoom: kamera.zoom, safe: prozor(),
        render: { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, sceneChildren: scena.children.length, objekataUGrupama: grupe.length },
        bounds: {
          x0: Math.min(...pts.map(v => (v.x + 1) / 2)), x1: Math.max(...pts.map(v => (v.x + 1) / 2)),
          y0: Math.min(...pts.map(v => (1 - v.y) / 2)), y1: Math.max(...pts.map(v => (1 - v.y) / 2)),
        },
        objects: grupe.map(g => g.el.id), view: pogledPlan ? 'plan' : '3d', target: trazeniKadar,
        labels: oznake.filter(o => o.postavljena).map(o => ({ id: o.e.id, x: Math.round(o.ax + o.dx), y: Math.round(o.ay + o.dy), w: Math.round(o.el.offsetWidth), h: Math.round(o.el.offsetHeight) })),
      };
    };
  }

  renderer.domElement.addEventListener('webglcontextlost', e => {
    e.preventDefault(); prikaziRezervnu(T.prekinut);
  });

  /* ---------- učitavanje ---------- */
  try {
    const [g, h] = await Promise.all([jsonl('data/GEOMETRIJA.jsonl'), jsonl('data/HIPOTEZE.jsonl')]);
    elementi = g.filter(e => e.prikaz !== false);
    h.forEach(x => hipoteze[x.id] = x);
    sagradi();
    objekatSelect.insertAdjacentHTML('beforeend',
      elementi.filter(e => e.tip !== 'teren').map(e => `<option value="${esc(e.id)}">${esc(ime(e))}</option>`).join(''));
    koren.classList.add('scena-spremna');
    koren.querySelector('.scena-poster')?.remove();
    uokviri(false);
    const trazen = opcije.element;
    const izabran = elementi.find(e => e.id === trazen);
    const izvanTrazen = !izabran && trazen && g.find(e => e.id === trazen);
    if (izabran) pokazi(izabran);
    const izvan = g.filter(e => e.prikaz === false);
    if (izvanTrazen) {
      statusEl.innerHTML = `<b>${esc(izvanTrazen.id)}</b> (${esc(ime(izvanTrazen))}) ${esc(T.nijeUSceni1)}
        <a class="veza" href="pokrivenost.html?q=${encodeURIComponent(izvanTrazen.id)}">${esc(T.nijeUSceni2)}</a>`;
    } else {
      statusEl.innerHTML = izvan.length
        ? `${esc(T.izvanPrikaza)} <b>${izvan.map(e2 => esc(e2.id)).join(', ')}</b>. <a class="veza" href="pokrivenost.html">${esc(T.vidiPokrivenost)}</a>` : '';
    }
    requestAnimationFrame(petlja);
  } catch (e) {
    statusEl.textContent = T.greska + ' (' + e.message + ')';
    prikaziRezervnu(T.rezervna);
  }

  return { kamera, kontrole, scena, uokviri, promeniPogled, pokazi };
}
