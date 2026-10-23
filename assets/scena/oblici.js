/* Medijana — registar oblika radne makete.
   Jedini fajl koji se menja kad maketa dobije novu vrstu geometrije.
   Svaki oblik: obavezna polja u `dim` i funkcija `gradi` koja crta u grupu.
   Modul ne uvozi THREE — dobija ga kroz ctx, pa ga i Node validator može
   učitati i proveriti da svaki zapis u GEOMETRIJA.jsonl ima poznat oblik. */

export const POUZDANOSTI = ['objavljena_dimenzija', 'izvedeno_iz_povrsine', 'sematski'];

/* ctx: { THREE, dodaj(geo, px, pz, ry, py), kutija(x,y,z), D (e.dim), h, TLO, MREZA, slabiji } */
export const OBLICI = {
  kutija: {
    polja: ['x', 'z'],
    gradi({ dodaj, kutija, D, h }) { dodaj(kutija(D.x, h, D.z)); },
  },
  prsten: {
    polja: ['spolja_x', 'spolja_z', 'unutra_x', 'unutra_z'],
    gradi({ dodaj, kutija, D, h }) {
      const tx = (D.spolja_x - D.unutra_x) / 2, tz = (D.spolja_z - D.unutra_z) / 2;
      dodaj(kutija(D.spolja_x, h, tz), 0, -(D.unutra_z + tz) / 2);
      dodaj(kutija(D.spolja_x, h, tz), 0, (D.unutra_z + tz) / 2);
      dodaj(kutija(tx, h, D.unutra_z), -(D.unutra_x + tx) / 2, 0);
      dodaj(kutija(tx, h, D.unutra_z), (D.unutra_x + tx) / 2, 0);
    },
  },
  kolonada_prsten: {
    polja: ['x', 'z', 'visina_stuba_m', 'precnik_stuba_m', 'razmak_m'],
    gradi({ THREE, dodaj, D, h }) {
      const vs = Math.min(h, D.visina_stuba_m),
        geo = new THREE.CylinderGeometry(D.precnik_stuba_m / 2, D.precnik_stuba_m / 2, vs, 12);
      const hx = D.x / 2 - 1, hz = D.z / 2 - 1, korak = D.razmak_m;
      for (let x = -hx; x <= hx; x += korak) { dodaj(geo.clone(), x, -hz, 0, vs / 2); dodaj(geo.clone(), x, hz, 0, vs / 2); }
      for (let z = -hz + korak; z <= hz - korak; z += korak) { dodaj(geo.clone(), -hx, z, 0, vs / 2); dodaj(geo.clone(), hx, z, 0, vs / 2); }
    },
  },
  kolonada_dvoredna: {
    polja: ['duzina_x', 'razmak_x', 'razmak_z', 'precnik_m'],
    gradi({ THREE, dodaj, D, h }) {
      const vs = Math.min(h, D.visina_m || h);
      const geo = new THREE.CylinderGeometry(D.precnik_m / 2, D.precnik_m / 2, vs, 12);
      const n = Math.floor(D.duzina_x / D.razmak_x) + 1, x0 = -D.duzina_x / 2;
      for (const z_off of [-D.razmak_z / 2, D.razmak_z / 2])
        for (let i = 0; i < n; i++) dodaj(geo.clone(), x0 + i * D.razmak_x, z_off, 0, vs / 2);
    },
  },
  apsida: {
    polja: ['dubina', 'r'],
    gradi({ THREE, dodaj, kutija, D, h }) {
      dodaj(kutija(D.dubina, h, D.r * 2), -D.dubina / 2, 0);
      dodaj(new THREE.CylinderGeometry(D.r, D.r, h, 24, 1, false, 0, Math.PI), 0, 0, Math.PI / 2);
    },
  },
  oktogon: {
    polja: ['r'],
    gradi({ THREE, dodaj, D, h }) { dodaj(new THREE.CylinderGeometry(D.r, D.r, h, 8)); },
  },
  bazilika: {
    polja: ['x', 'z', 'r_apside'],
    gradi({ THREE, dodaj, kutija, D, h }) {
      dodaj(kutija(D.x, h, D.z));
      dodaj(new THREE.CylinderGeometry(D.r_apside, D.r_apside, h, 24, 1, false, 0, Math.PI), D.x / 2, 0, -Math.PI / 2);
    },
  },
  cilindri_mreza: {
    polja: ['precnik_m', 'visina_m', 'po_redu', 'redova'],
    gradi({ THREE, dodaj, D }) {
      const geo = new THREE.CylinderGeometry(D.precnik_m / 2, D.precnik_m / 2, D.visina_m, 14);
      const kx = (D.po_redu - 1) * 3.2, kz = (D.redova - 1) * 4.5;
      for (let r = 0; r < D.redova; r++) for (let c = 0; c < D.po_redu; c++)
        dodaj(geo.clone(), -kx / 2 + c * 3.2, -kz / 2 + r * 4.5, 0, D.visina_m / 2 - 0.8);
    },
  },
  ravan: {
    polja: ['x', 'z'],
    gradi({ THREE, D, g, TLO, PAPIR, MREZA, slabiji }) {
      /* papirno tlo: blagi radijalni gradijent umesto jednolične boje */
      const c = document.createElement('canvas'); c.width = c.height = 512;
      const cx = c.getContext('2d');
      const gr = cx.createRadialGradient(256, 256, 40, 256, 256, 330);
      gr.addColorStop(0, TLO); gr.addColorStop(1, PAPIR);
      cx.fillStyle = gr; cx.fillRect(0, 0, 512, 512);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const M = new THREE.Mesh(new THREE.PlaneGeometry(D.x, D.z),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 1, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 }));
      M.rotation.x = -Math.PI / 2; if (!slabiji) M.receiveShadow = true; g.add(M);
      /* raster tačno u granicama tla (GridHelper je kvadrat pa je virio preko
         ivica) i dignut iznad podloge da dubinski ne treperi sa njom */
      const korak = 20, poz = [];
      for (let x = -D.x / 2; x <= D.x / 2 + 1e-6; x += korak) poz.push(x, 0, -D.z / 2, x, 0, D.z / 2);
      for (let z = -D.z / 2; z <= D.z / 2 + 1e-6; z += korak) poz.push(-D.x / 2, 0, z, D.x / 2, 0, z);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(poz, 3));
      const mreza = new THREE.LineSegments(geo,
        new THREE.LineBasicMaterial({ color: MREZA, transparent: true, opacity: 0.4 }));
      mreza.position.y = 0.1; g.add(mreza);
    },
  },
};

export const SPISAK_OBLIKA = Object.keys(OBLICI);

/* Provera jednog zapisa iz GEOMETRIJA.jsonl — koristi je i sajt i Node validator. */
export function proveriZapis(e) {
  const greske = [];
  if (!OBLICI[e.oblik]) { greske.push(`nepoznat oblik "${e.oblik}" (poznati: ${SPISAK_OBLIKA.join(', ')})`); return greske; }
  if (e.tip !== 'teren' && !POUZDANOSTI.includes(e.pouzdanost)) greske.push(`nepoznata pouzdanost "${e.pouzdanost}"`);
  for (const p of OBLICI[e.oblik].polja)
    if (!Number.isFinite(e.dim?.[p])) greske.push(`dim.${p} nedostaje ili nije broj`);
  if (e.tip !== 'teren') {
    for (const p of ['visina_rek_m', 'visina_sacuvana_m'])
      if (!Number.isFinite(e[p])) greske.push(`${p} nedostaje ili nije broj`);
  }
  return greske;
}
