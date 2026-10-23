/* Medijana — 3D pregledač bele makete, jedan modul za ceo suite.
   Koriste ga blizanac.html (puna stranica) i naslovna (prvi ekran, 100dvh).
   Sve boje dolaze iz CSS tokena stranice: papir, mastilo i dokazne boje.
   Poreklo svake mere nosi boja ivice, ne zapremina: maketa je bela,
   kao arhitektonski radni model na papiru. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const REC = {
  sr: {
    ceo: 'Ceo kompleks', osnova: 'Osnova', izaberi: 'Izaberi objekat…',
    rek: 'Rekonstrukcija', sac: 'Sačuvano stanje', oznake: 'Oznake', legenda: 'Legenda',
    legendaNaslov: 'Poštena maketa', legendaUvod: 'Radna maketa sa šematskim rasporedom. Ivica nosi poreklo mera:',
    p1: 'objavljena dimenzija', p2: 'izvedeno iz objavljene površine', p3: 'šematski — čeka plan (P2)',
    legendaKraj: 'Klik na objekat otvara njegov dokaz i granice. Međusobni raspored je šematski i nije georeferenciran.',
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
    legendaNaslov: 'An honest model', legendaUvod: 'A working model with a schematic layout. The edge carries the origin of each dimension:',
    p1: 'published dimension', p2: 'derived from a published area', p3: 'schematic — awaiting plans (P2)',
    legendaKraj: 'Click an object to open its evidence and limits. The mutual layout is schematic and not georeferenced.',
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
  const smanjeniPokret = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const kamera = new THREE.PerspectiveCamera(50, 1, 0.1, 5000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  koren.appendChild(renderer.domElement);

  const kontrole = new OrbitControls(kamera, renderer.domElement);
  kontrole.maxPolarAngle = Math.PI / 2.05;
  kontrole.enableDamping = true;
  kontrole.dampingFactor = 0.08;

  /* svetlo ateljea: nebo, topla podloga i sunce sa mekim senkama */
  scena.add(new THREE.HemisphereLight(0xffffff, 0xb8b2a4, 0.85));
  const sunce = new THREE.DirectionalLight(0xfff6e8, 1.45);
  sunce.position.set(-160, 240, 140);
  sunce.castShadow = true;
  sunce.shadow.mapSize.set(2048, 2048);
  sunce.shadow.bias = -0.0006;
  Object.assign(sunce.shadow.camera, { left: -280, right: 280, top: 280, bottom: -280, far: 900 });
  scena.add(sunce);

  /* ---------- bela maketa ---------- */
  const BELA = new THREE.Color('#f8f6f1');
  const materijal = e => {
    const c = BELA.clone();
    if (BOJE_DOKAZA[e.pouzdanost]) c.lerp(new THREE.Color(BOJE_DOKAZA[e.pouzdanost]), 0.10);
    return new THREE.MeshStandardMaterial({
      color: c, roughness: 0.94, metalness: 0,
      transparent: e.pouzdanost === 'sematski', opacity: e.pouzdanost === 'sematski' ? 0.55 : 1,
    });
  };
  const kutija = (x, y, z) => new THREE.BoxGeometry(x, y, z);

  function oblik(e, h) {
    const g = new THREE.Group(), m = materijal(e), D = e.dim;
    const dodaj = (geo, px = 0, pz = 0, ry = 0, py = h / 2) => {
      const M = new THREE.Mesh(geo, m);
      M.position.set(px, py, pz); M.rotation.y = ry;
      M.castShadow = M.receiveShadow = true; g.add(M); return M;
    };
    switch (e.oblik) {
      case 'kutija': dodaj(kutija(D.x, h, D.z)); break;
      case 'prsten': {
        const tx = (D.spolja_x - D.unutra_x) / 2, tz = (D.spolja_z - D.unutra_z) / 2;
        dodaj(kutija(D.spolja_x, h, tz), 0, -(D.unutra_z + tz) / 2);
        dodaj(kutija(D.spolja_x, h, tz), 0, (D.unutra_z + tz) / 2);
        dodaj(kutija(tx, h, D.unutra_z), -(D.unutra_x + tx) / 2, 0);
        dodaj(kutija(tx, h, D.unutra_z), (D.unutra_x + tx) / 2, 0);
        break; }
      case 'kolonada_prsten': {
        const vs = Math.min(h, D.visina_stuba_m), geo = new THREE.CylinderGeometry(D.precnik_stuba_m / 2, D.precnik_stuba_m / 2, vs, 12);
        const hx = D.x / 2 - 1, hz = D.z / 2 - 1, korak = D.razmak_m;
        for (let x = -hx; x <= hx; x += korak) { dodaj(geo.clone(), x, -hz, 0, vs / 2); dodaj(geo.clone(), x, hz, 0, vs / 2); }
        for (let z = -hz + korak; z <= hz - korak; z += korak) { dodaj(geo.clone(), -hx, z, 0, vs / 2); dodaj(geo.clone(), hx, z, 0, vs / 2); }
        break; }
      case 'kolonada_dvoredna': {
        const vs = Math.min(h, D.visina_m || h);
        const geo = new THREE.CylinderGeometry(D.precnik_m / 2, D.precnik_m / 2, vs, 12);
        const n = Math.floor(D.duzina_x / D.razmak_x) + 1, x0 = -D.duzina_x / 2;
        for (const z_off of [-D.razmak_z / 2, D.razmak_z / 2])
          for (let i = 0; i < n; i++) dodaj(geo.clone(), x0 + i * D.razmak_x, z_off, 0, vs / 2);
        break; }
      case 'apsida': {
        dodaj(kutija(D.dubina, h, D.r * 2), -D.dubina / 2, 0);
        dodaj(new THREE.CylinderGeometry(D.r, D.r, h, 24, 1, false, 0, Math.PI), 0, 0, Math.PI / 2);
        break; }
      case 'oktogon': dodaj(new THREE.CylinderGeometry(D.r, D.r, h, 8)); break;
      case 'bazilika': {
        dodaj(kutija(D.x, h, D.z));
        dodaj(new THREE.CylinderGeometry(D.r_apside, D.r_apside, h, 24, 1, false, 0, Math.PI), D.x / 2, 0, -Math.PI / 2);
        break; }
      case 'cilindri_mreza': {
        const geo = new THREE.CylinderGeometry(D.precnik_m / 2, D.precnik_m / 2, D.visina_m, 14);
        const kx = (D.po_redu - 1) * 3.2, kz = (D.redova - 1) * 4.5;
        for (let r = 0; r < D.redova; r++) for (let c = 0; c < D.po_redu; c++)
          dodaj(geo.clone(), -kx / 2 + c * 3.2, -kz / 2 + r * 4.5, 0, D.visina_m / 2 - 0.8);
        break; }
      case 'ravan': {
        const M = new THREE.Mesh(new THREE.PlaneGeometry(D.x, D.z), new THREE.MeshStandardMaterial({ color: TLO, roughness: 1 }));
        M.rotation.x = -Math.PI / 2; M.receiveShadow = true; g.add(M);
        const mreza = new THREE.GridHelper(Math.max(D.x, D.z), Math.max(D.x, D.z) / 20, MREZA, MREZA);
        mreza.material.opacity = 0.4; mreza.material.transparent = true;
        mreza.position.y = 0.02; g.add(mreza);
        break; }
    }
    g.position.set(e.pos[0], 0, e.pos[1]);
    g.rotation.y = (e.rot_deg || 0) * Math.PI / 180;
    /* ivica u boji dokaza: crtež na beloj zapremini */
    if (e.tip !== 'teren' && !['kolonada_prsten', 'kolonada_dvoredna', 'cilindri_mreza'].includes(e.oblik)) {
      for (const mesh of [...g.children]) {
        if (!mesh.isMesh) continue;
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const boja = new THREE.Color(BOJE_DOKAZA[e.pouzdanost] || '#6c6a65');
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
        <button type="button" data-radnja="kadar">${esc(T.ceo)}</button>
        <button type="button" data-radnja="plan" aria-pressed="false">${esc(T.osnova)}</button>
        <select class="scena-objekat" aria-label="${esc(T.izaberi)}"><option value="">${esc(T.izaberi)}</option></select>
      </div>
      <button type="button" data-radnja="rek" class="on">${esc(T.rek)}</button>
      <button type="button" data-radnja="sac">${esc(T.sac)}</button>
      <button type="button" data-radnja="oznake" class="on">${esc(T.oznake)}</button>
      <button type="button" data-radnja="legenda" aria-expanded="false" aria-controls="scena-legenda">${esc(T.legenda)}</button>
      ${punaStrana ? '<a class="scena-glb" href="modeli/medijana.glb" download>GLB</a>' : ''}
    </div>
    <aside class="scena-legenda" id="scena-legenda" hidden>
      <h2>${esc(T.legendaNaslov)}</h2>
      <p>${esc(T.legendaUvod)}</p>
      <div class="scena-stavka"><span class="scena-uz scena-u1"></span>${esc(T.p1)}</div>
      <div class="scena-stavka"><span class="scena-uz scena-u2"></span>${esc(T.p2)}</div>
      <div class="scena-stavka"><span class="scena-uz scena-u3"></span>${esc(T.p3)}</div>
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
    oznake.forEach(o => o.el.remove()); oznake = [];
    for (const e of elementi) {
      const h = e.tip === 'teren' ? 0 : Math.max(rezim === 'rek' ? e.visina_rek_m : e.visina_sacuvana_m, 0.05);
      const obj = oblik(e, h);
      obj.traverse(o => { o.userData.el = e; });
      scena.add(obj); grupe.push({ obj, el: e });
      if (e.tip !== 'teren') {
        const d = document.createElement('div');
        d.className = 'scena-oznaka'; d.textContent = e.naziv;
        koren.appendChild(d);
        oznake.push({ el: d, e, pos: new THREE.Vector3(e.pos[0], h + 3, e.pos[1]), ax: 0, ay: 0, dx: 0, dy: 0, postavljena: false });
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
    let x0 = 0.055 * w, x1 = 0.945 * w;
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
    const postavljeni = [], linije = [], smesteni = new Set();
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
      o.ax = ax; o.ay = ay;
      o.dx = p.x + wL / 2 - ax; o.dy = p.y + hL / 2 - ay;
      o.postavljena = true;
      smesteni.add(o);
      /* pokazna linija kad je natpis pomeren sa objekta */
      const lp = { x: Math.max(p.x, Math.min(ax, p.x + wL)), y: p.y + hL };
      if (Math.hypot(lp.x - ax, lp.y - ay) > 16)
        linije.push({ x1: ax, y1: ay, x2: lp.x, y2: lp.y });
    }
    for (const o of oznake) {
      o.el.classList.toggle('scena-oznaka-van', !smesteni.has(o) || !oznakeOn);
    }
    linijeEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
    linijeEl.innerHTML = linije.map(l =>
      `<line x1="${l.x1.toFixed(1)}" y1="${l.y1.toFixed(1)}" x2="${l.x2.toFixed(1)}" y2="${l.y2.toFixed(1)}"/>`).join('');
  }

  /* između rasporeda natpisi samo prate projekciju, bez promene vidljivosti */
  function pratiOznake() {
    const w = koren.clientWidth, h = koren.clientHeight;
    for (const o of oznake) {
      if (!o.postavljena) continue;
      const v = o.pos.clone().project(kamera);
      const x = (v.x + 1) / 2 * w + o.dx, y = (-v.y + 1) / 2 * h + o.dy;
      o.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;
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
      const box = new THREE.Box3().setFromObject(g.obj);
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
      <span class="id">${esc(e.id)} · ${esc(e.nivo)}</span><h3>${esc(e.naziv)}</h3>
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
    oznakeOn = !oznakeOn; dugme('oznake').classList.toggle('on', oznakeOn); prljaviNatpisi = true;
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
  kontrole.addEventListener('change', () => { poslednjiPoremecaj = trenutniTren; });
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
    requestAnimationFrame(petlja);
  }

  function uskladiVelicinu() {
    const w = koren.clientWidth, h = koren.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
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
      elementi.filter(e => e.tip !== 'teren').map(e => `<option value="${esc(e.id)}">${esc(e.naziv)}</option>`).join(''));
    koren.classList.add('scena-spremna');
    koren.querySelector('.scena-poster')?.remove();
    uokviri(false);
    const trazen = opcije.element;
    const izabran = elementi.find(e => e.id === trazen);
    const izvanTrazen = !izabran && trazen && g.find(e => e.id === trazen);
    if (izabran) pokazi(izabran);
    const izvan = g.filter(e => e.prikaz === false);
    if (izvanTrazen) {
      statusEl.innerHTML = `<b>${esc(izvanTrazen.id)}</b> (${esc(izvanTrazen.naziv)}) ${esc(T.nijeUSceni1)}
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
