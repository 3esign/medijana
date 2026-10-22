'use strict';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let data, selected = [];
const names = {hypotheses:'HIPOTEZE',questions:'PITANJA',conflicts:'KONTRADIKCIJE',geometry:'GEOMETRIJA'};
const params = new URLSearchParams(location.search);
$('search').value = params.get('q') || '';
if (['hypotheses','questions','conflicts'].includes(params.get('kind'))) $('kind').value = params.get('kind');
if (/^N[0-6]$/.test(params.get('level') || '')) $('level').value = params.get('level');
function related(row) { return data.geometry.filter(g => (g.hipoteze || []).includes(row.id)); }
function render() {
  if (!data) return;
  const query = normalize($('search').value), level = $('level').value, kind = $('kind').value;
  selected = data[kind].filter(row => (!level || (row.nivoi || [row.nivo]).includes(level)) && normalize(JSON.stringify(row)+' '+related(row).map(g=>g.naziv).join(' ')).includes(query));
  $('count').textContent = `${selected.length} od ${data[kind].length} zapisa · ${names[kind]}.jsonl`;
  $('results').innerHTML = selected.length ? selected.map(row => {
    const geometry = related(row), title = row.naslov || row.pitanje;
    const links = geometry.map(g => `<a href="blizanac.html?element=${encodeURIComponent(g.id)}">${escapeHTML(g.naziv)} → 3D</a>`).join('');
    const conflicts = kind === 'hypotheses' ? data.conflicts.filter(c => (row.resava || []).includes(c.id) || c.resenje === row.id) : [];
    return `<article id="${escapeHTML(row.id)}"><div class="row"><span class="meta">${escapeHTML(row.id)} · ${escapeHTML((row.nivoi || [row.nivo]).filter(Boolean).join(' / '))}</span><span class="status">${escapeHTML(row.status || 'OTVORENO PITANJE')}</span></div><h2>${escapeHTML(title)}</h2><p>${escapeHTML(row.tvrdnja || row.sukob || row.disciplina || '')}</p>${row.test ? `<div class="evidence"><p><b>Kako proveriti</b>${escapeHTML(row.test)}</p><p><b>Podržalo bi</b>${escapeHTML(row.potvrda)}</p><p><b>Osporilo bi</b>${escapeHTML(row.opovrgnuce)}</p></div>` : ''}${row.resenje ? `<p><b>Predloženo razrešenje:</b> ${/^M-H\d+$/.test(row.resenje) ? `<a href="?kind=hypotheses&q=${encodeURIComponent(row.resenje)}">${escapeHTML(row.resenje)}</a>` : escapeHTML(row.resenje)}</p>` : ''}<div class="links">${links}<a href="?kind=${kind}&q=${encodeURIComponent(row.id)}#${escapeHTML(row.id)}">Veza na zapis</a></div>${kind === 'hypotheses' && !geometry.length ? '<p class="meta">Ova hipoteza još nema vezan objekat u geometrijskom registru.</p>' : ''}${conflicts.length ? `<details><summary>Povezane kontradikcije (${conflicts.length})</summary>${conflicts.map(c=>`<p><a href="?kind=conflicts&q=${encodeURIComponent(c.id)}">${escapeHTML(c.id)}</a> — ${escapeHTML(c.sukob)}</p>`).join('')}</details>` : ''}${geometry.length ? `<details><summary>Poreklo prostornih veza</summary>${geometry.map(g=>`<p>${escapeHTML(g.id)} · ${escapeHTML(g.pouzdanost)} · ${escapeHTML((g.izvori||[]).join(', '))}</p>`).join('')}<p class="meta">Oznake A-MEDIJANA pripadaju izvornom registru literature. Nisu automatski istovetne oznakama MED na stranici Izvori; povezivanje publikacija zahteva proveru.</p></details>` : ''}</article>`;
  }).join('') : '<p>Nema zapisa za ovaj izbor. Obriši pretragu ili izaberi sve nivoe.</p>';
  const url = new URL(location.href); url.search = ''; url.searchParams.set('kind',kind);
  if ($('search').value) url.searchParams.set('q',$('search').value);
  if (level) url.searchParams.set('level',level);
  history.replaceState(null,'',url);
}
async function load() {
  $('retry').hidden = true; $('count').textContent = 'Učitavanje registara…';
  try {
    data = Object.fromEntries(await Promise.all(Object.entries(names).map(async ([key,file]) => {
      const response = await fetch(`data/${file}.jsonl`);
      if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
      return [key,(await response.text()).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)];
    })));
    render(); $('export').disabled = false;
    if(location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  } catch(error) { $('count').textContent = `Registri nisu dostupni. Otvori preko HTTP servera. ${error.message}`; $('retry').hidden = false; }
}
$('search').addEventListener('input',render);
$('kind').addEventListener('change',render);
$('level').addEventListener('change',render);
$('retry').addEventListener('click',load);
$('print').addEventListener('click',()=>window.print());
$('export').addEventListener('click',()=>{
  const geometry = [...new Map(selected.flatMap(related).map(g=>[g.id,g])).values()];
  const packet = {exported_at:new Date().toISOString(),source_register:`data/${names[$('kind').value]}.jsonl`,filters:{query:$('search').value,level:$('level').value},limitation:'Research plan only; geometry is schematic; no scientific validation implied.',records:selected,related_geometry:geometry};
  const url=URL.createObjectURL(new Blob([JSON.stringify(packet,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='medijana-istrazivacki-izbor.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
load();
