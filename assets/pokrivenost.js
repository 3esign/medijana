'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={sematski:'Šematske mere',izvedeno_iz_povrsine:'Izvedeno iz površine',objavljena_dimenzija:'Preneta objavljena dimenzija'};
let rows=[],selected=[];
$('search').value=new URLSearchParams(location.search).get('q')||'';
function render(){
 const q=$('search').value.trim().toLocaleLowerCase('sr');
 const exact=rows.some(r=>r.id.toLocaleLowerCase('sr')===q);
 selected=rows.filter(r=>(!$('kind').value||r.pouzdanost===$('kind').value)&&(exact?r.id.toLocaleLowerCase('sr')===q:JSON.stringify(r).toLocaleLowerCase('sr').includes(q)));
 $('count').textContent=`${selected.length} od ${rows.length} elemenata`;
 $('results').innerHTML=selected.length?selected.map(r=>`<article id="${esc(r.id)}"><span class="meta">${esc(r.id)} · ${esc(r.nivo)}</span><h2>${esc(r.naziv)}</h2>${r.prikaz===false?'<p><strong>ISKLJUČENO IZ PROSTORNOG PRIKAZA · sporan identitet lokaliteta</strong></p>':''}<div class="evidence"><p><b>Mere</b>${esc(labels[r.pouzdanost]||r.pouzdanost)}</p><p><b>Položaj</b>${r.polozaj==='sematski'?'Šematski · nije georeferenciran':esc(r.polozaj)}</p><p><b>Visine u maketi</b>${esc(r.visina_sacuvana_m)} / ${esc(r.visina_rek_m)} m<br><span class="meta">Vrednosti iz registra; bez pojedinačne potvrde merenja.</span></p></div><p>${esc(r.napomena)}</p><h3>Trag do literature</h3>${r.references.map(ref=>`<p class="reference">${esc(ref.id)} → ${ref.exists?`<a href="izvori.html#${esc(ref.candidate)}">${esc(ref.candidate)}</a>`:'nerazrešeno'} · <strong>${ref.status==='blokirano'?'BLOKIRANO ZA MERE':(ref.status==='potvrdjena_veza'?'POTVRĐENA BIBLIOGRAFSKA VEZA':'KANDIDAT ZA POVEZIVANJE')}</strong><br><span class="muted">${esc(ref.note)}</span></p>`).join('')}<details><summary>Šta sledeće pribaviti</summary><ol>${r.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details><div class="links"><a href="blizanac.html?element=${encodeURIComponent(r.id)}">Otvori objekat u 3D</a>${(r.hipoteze||[]).map(h=>`<a href="istrazivanje.html?q=${encodeURIComponent(h)}">${esc(h)}</a>`).join('')}<a href="?q=${encodeURIComponent(r.id)}">Veza na karton</a></div></article>`).join(''):'<p>Nema elemenata za ovaj izbor.</p>';
 const url=new URL(location.href);url.search='';if(q)url.searchParams.set('q',$('search').value);history.replaceState(null,'',url);
}
async function load(){
 $('retry').hidden=true;
 try{
  const [geometry,sources,links]=await Promise.all(['GEOMETRIJA','IZVORI','VEZE_IZVORA'].map(async name=>{const r=await fetch(`data/${name}.jsonl`);if(!r.ok)throw Error(`${name}: ${r.status}`);return(await r.text()).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);}));
  rows=MedijanaCoverage.analyze(geometry,sources,links);
  $('summary').textContent=`${rows.length} elemenata · ${rows.filter(r=>r.pouzdanost==='objavljena_dimenzija').length} sa prenetim objavljenim dimenzijama · ${rows.filter(r=>r.pouzdanost==='izvedeno_iz_povrsine').length} izvedena iz površine · ${rows.filter(r=>r.pouzdanost==='sematski').length} šematskih. Položaj je šematski za ${rows.filter(r=>r.polozaj==='sematski').length} elemenata.`;
  render();$('export').disabled=false;
 }catch(e){$('count').textContent=`Podaci nisu učitani: ${e.message}. Pokušaj ponovo ili otvori izvorne registre ispod.`;$('retry').hidden=false;}
}
$('search').addEventListener('input',render);$('kind').addEventListener('change',render);$('retry').addEventListener('click',load);$('print').addEventListener('click',()=>print());
$('export').addEventListener('click',()=>{const packet={exported_at:new Date().toISOString(),scope:'Pregled postojećih metapodataka; nije stručna potvrda niti terensko merenje.',records:selected};const u=URL.createObjectURL(new Blob([JSON.stringify(packet,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='medijana-pokrivenost.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
load();
