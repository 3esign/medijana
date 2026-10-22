const REG = {
  hipoteze: {file:'data/HIPOTEZE.jsonl', label:'Hipoteze', kod:'M-H', render:r=>zapis(r.id, r.naslov,
    `<p>${esc(r.tvrdnja)}</p><p><b>Test:</b> ${esc(r.test)}</p><p><b>Potvrda:</b> ${esc(r.potvrda)}</p><p><b>Opovrgnuće:</b> ${esc(r.opovrgnuce)}</p>`,
    [[st(r.status), r.status], ...r.nivoi.map(n=>['gol',n]), ...(r.resava||[]).map(k=>['gol','rešava '+k]), ['gol','paradata '+r.paradata]])},
  kontradikcije: {file:'data/KONTRADIKCIJE.jsonl', label:'Kontradikcije', kod:'KR', render:r=>zapis(r.id, r.naslov,
    `<p>${esc(r.sukob)}</p><p><b>Rešenje:</b> ${esc(r.resenje)}</p>`, [[st(r.status), r.status]])},
  pitanja: {file:'data/PITANJA.jsonl', label:'Pitanja', kod:'M-Q', render:r=>zapis(r.id, r.pitanje,
    `<p><b>Disciplina:</b> ${esc(r.disciplina)}</p>`, [['gol', r.nivo], ...(r.veza?[['gol','mapa '+r.veza]]:[])])},
  geometrija: {file:'data/GEOMETRIJA.jsonl', label:'Geometrija', kod:'G', render:r=>zapis(r.id, r.naziv,
    `<p>${esc(r.napomena)}</p><p><b>Sačuvano:</b> ${r.visina_sacuvana_m} m · <b>rekonstruisano:</b> ${r.visina_rek_m} m</p>`,
    [[MED.klasa(r.pouzdanost), r.pouzdanost.replace(/_/g,' ')], ...(r.prikaz===false?[['dx','izvan prikaza']]:[]),
     ['gol','položaj: '+r.polozaj], ...(r.izvori||[]).map(i=>['gol',i])])},
  lokacije: {file:'data/LOKACIJE.jsonl', label:'Lokacije', kod:'L', render:r=>zapis(r.id, r.naziv,
    `<p>${esc(r.odnos)}</p><p>${esc(r.napomena)}</p><p><b>Period:</b> ${esc(r.period)}</p>`,
    [[r.preciznost==='priblizno'?'d3':'d2','koordinata: '+r.preciznost], ...(r.izvori||[]).map(i=>[i==='opste'?'dx':'gol', i==='opste'?'opšte — čeka referencu':i])])},
  hronologija: {file:'data/HRONOLOGIJA.jsonl', label:'Hronologija', kod:'HR', render:r=>zapis(r.id, `${r.prikaz} — ${r.dogadjaj}`,
    `<p>${esc(r.napomena)}</p>`,
    [[r.status==='PO_IZVORU'?'d1':r.status==='OPSTE_PRIHVACENO'?'d2':'d3', r.status.replace(/_/g,' ')], ['gol',r.tip],
     ...(r.izvori||[]).map(i=>[i==='opste'?'dx':'gol', i==='opste'?'opšte':i])])},
  izvori: {file:'data/IZVORI.jsonl', label:'Izvori', kod:'MED', render:r=>zapis(r.id, `${r.autori} (${r.godina}): ${r.naslov}`,
    `<p><i>${esc(r.publikacija)}</i></p><p><b>Podupire:</b> ${esc(r.supports)}</p><p><b>Granice:</b> ${esc(r.limits)}</p>`,
    [['gol','talas '+r.talas]])},
  veze: {file:'data/VEZE_IZVORA.jsonl', label:'Veze izvora', kod:'A→MED', render:r=>zapis(r.id, `${r.id} → ${r.candidate}`,
    `<p><b>Osnov:</b> ${esc(r.basis)}</p><p>${esc(r.note)}</p>`,
    [[r.status==='potvrdjena_veza'?'d1':r.status==='blokirano'?'dx':'d3', String(r.status||'').replace(/_/g,' ')],
     ...(r.evidence||[]).map(e=>['gol','dokaz '+e]), ...(r.checked_at?[['gol','provera '+r.checked_at]]:[])])},
  recnik: {file:'data/RECNIK.jsonl', label:'Rečnik', kod:'—', render:r=>zapis('', r.term,
    `<p>${esc(r.definition)}</p>${r.source?`<p><b>Izvor:</b> ${esc(r.source)}</p>`:''}`, [])},
  nivoi: {file:'data/NIVOI.jsonl', label:'Nivoi analize', kod:'N', render:r=>zapis(r.id, r.ime,
    `<p><b>Razmera:</b> ${esc(r.razmera)} · ${esc(r.objekat)}</p>`+
    `<p><b>Discipline:</b> ${esc(str(r.discipline))}</p>`+
    `<p><b>Metode:</b> ${esc(str(r.metode))}</p>`+
    `<p><b>Na Medijani:</b> ${esc(str(r.medijana))}</p>`+
    `<p><b>HBIM sloj:</b> ${esc(r.hbim_sloj)}</p>`, (r.izvori||[]).map(i=>['gol',i]))},
};
const esc = s => MED.esc(s);
const str = v => Array.isArray(v) ? v.join(', ') : typeof v==='object'&&v ? Object.values(v).join(' · ') : v;
const st = s => s==='RAZRESENO'?'d1':s==='PRAVILO'?'d1':s==='OTVORENO'?'d2':'d3';
function zapis(id, naslov, telo, znaci){
  return `<article class="zapis">${id?`<span class="id">${esc(id)}</span>`:''}<h3>${esc(naslov)}</h3>${telo}`+
    znaci.map(([k,t])=>`<span class="znak ${k}">${esc(t)}</span>`).join('')+`</article>`;
}

let tekuci = 'hipoteze', redovi = [], brojevi = {};
const kartice = document.getElementById('kartice');
const napomena = document.getElementById('napomena');
const pretraga = document.getElementById('pretraga');

const tabovi = document.getElementById('tabovi');
tabovi.innerHTML = Object.entries(REG).map(([k,v])=>
  `<button type="button" data-k="${k}">${v.label}<span class="n" data-n="${k}"></span></button>`).join('');
tabovi.addEventListener('click', e=>{ const b=e.target.closest('button'); if(b) prikazi(b.dataset.k); });
pretraga.addEventListener('input', crtaj);

function crtaj(){
  const q = pretraga.value.trim().toLowerCase();
  const vidljivi = q ? redovi.filter(r=>JSON.stringify(r).toLowerCase().includes(q)) : redovi;
  kartice.innerHTML = vidljivi.map(REG[tekuci].render).join('') ||
    `<p class="meta">Nema zapisa za „${esc(pretraga.value)}“ u registru ${esc(REG[tekuci].label)}.</p>`;
  if(q) obelezi(q);
  napomena.textContent = `${vidljivi.length}${q?' od '+redovi.length:''} zapisa · izvor: ${REG[tekuci].file}`;
}
function obelezi(q){
  const hod = document.createTreeWalker(kartice, NodeFilter.SHOW_TEXT);
  const meta = [];
  while(hod.nextNode()){ if(hod.currentNode.nodeValue.toLowerCase().includes(q)) meta.push(hod.currentNode); }
  meta.forEach(n=>{
    const delovi = n.nodeValue.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'ig'));
    const frag = document.createDocumentFragment();
    delovi.forEach((d,i)=>{
      if(i%2){ const m=document.createElement('mark'); m.textContent=d; frag.appendChild(m); }
      else frag.appendChild(document.createTextNode(d));
    });
    n.replaceWith(frag);
  });
}
async function prikazi(k){
  tekuci = k;
  if(location.hash.slice(1)!==k) history.replaceState(null,'','#'+k);
  document.querySelectorAll('#tabovi button').forEach(b=>b.classList.toggle('on', b.dataset.k===k));
  kartice.innerHTML=''; napomena.textContent='učitavanje…';
  try{
    redovi = await MED.jsonl(REG[k].file);
    brojevi[k]=redovi.length;
    const n=document.querySelector(`[data-n="${k}"]`); if(n) n.textContent=redovi.length;
    crtaj();
  }catch(e){
    napomena.textContent = `Registar se čita preko HTTP-a (GitHub Pages ili lokalni server); otvaranje sa diska ne može da učita ${REG[k].file}.`;
  }
}
prikazi(location.hash.slice(1) in REG ? location.hash.slice(1) : 'hipoteze');
addEventListener('hashchange', ()=>{ const k=location.hash.slice(1); if(k in REG && k!==tekuci) prikazi(k); });
// brojevi na tabovima, bez cekanja na klik
Object.entries(REG).forEach(([k,v])=>MED.jsonl(v.file).then(r=>{
  const n=document.querySelector(`[data-n="${k}"]`); if(n) n.textContent=r.length;
}).catch(()=>{}));
