const esc = s => MED.esc(s);
const TALASI={
  0:['Antički narativni izvori (IV vek)','Savremeni rimski istoričari i svedočanstva o carskim boravcima u Medijani.'],
  1:['Pionirski talas (1936–1940)','Miloje Vasić: prvi planovi vile i stibadijuma, mozaik Meduze. Prekinuto ratom.'],
  2:['Posleratni talas (1961–1975) i sinteze','Petar Petrović: terme, horreum, vodovod; topografija Naissusa; epigrafski korpus; teza o Konstantinovoj zadužbini.'],
  3:['Monografski i konzervatorski talas (2000–2016)','Gordana Milošević i Arheološki institut: oktogon, četiri faze vile, konzervacija mozaika, kapitalna monografija.'],
  4:['Savremeni talas (2020–2026)','Zaštitna konstrukcija, hidrantska mreža, severna crkva i „nekropola Gota“ — podaci na nivou preliminarnih izveštaja.']
};
(async()=>{
  const napomena=document.getElementById('napomena');
  try{
    const [izvori,hron]=await Promise.all([MED.jsonl('data/IZVORI.jsonl'),MED.jsonl('data/HRONOLOGIJA.jsonl')]);
    document.getElementById('literatura').innerHTML=[0,1,2,3,4].map(t=>{
      const grupa=izvori.filter(i=>i.talas===t);
      if(!grupa.length) return '';
      return `<section class="talas"><div class="okvir">
        <div class="talas-glava">
          <div>
            <div class="nadnaslov">Talas ${t} · ${grupa.length} ${grupa.length===1?'jedinica':'jedinice'}</div>
            <h2 style="margin-top:12px">${esc(TALASI[t][0])}</h2>
          </div>
          <p class="opis">${esc(TALASI[t][1])}</p>
        </div>
        <div class="resetka razmak-m">${grupa.map(i=>`<article class="izvor" id="${esc(i.id)}">
          <span class="id">${esc(i.id)}</span>
          <h3>${esc(i.autori)} (${esc(i.godina)}): ${esc(i.naslov)}</h3>
          <div class="pub">${esc(i.publikacija)}</div>
          <p><b>Podupire</b>${esc(i.supports)}</p>
          <p><b>Granice</b>${esc(i.limits)}</p>
          <p><b>Obim čitanja</b>${esc(i.read_scope)}</p>
          <span class="znak ${i.verification?'d1':'d3'}">${esc(i.verification?.status || 'preneto — nije provereno')}</span>
          ${i.verification?`<p class="meta" style="margin-top:9px">${esc(i.verification.note)} · ${esc(i.verification.checked_at)}</p>`:''}
          ${i.url && /^https:\/\//.test(i.url)?`<p style="margin-top:10px"><a class="veza" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">Original / DOI →</a></p>`:''}
        </article>`).join('')}</div></div></section>`;
    }).join('');

    const ZNAK={PO_IZVORU:['d1','po izvoru'],OPSTE_PRIHVACENO:['d2','opšte prihvaćeno'],NEPROVERENO:['d3','neprovereno']};
    document.getElementById('osa').innerHTML=hron.map(h=>{
      const z=ZNAK[h.status]||['dx',String(h.status||'').toLowerCase().replace(/_/g,' ')];
      return `<li class="${esc(h.tip)}">
        <span class="god">${esc(h.prikaz)}</span>
        <h3>${esc(h.dogadjaj)}</h3>
        <p>${esc(h.napomena)}</p>
        <span class="znak ${z[0]}">${esc(z[1])}</span>
        ${(h.izvori||[]).map(i=>`<span class="znak ${i==='opste'?'dx':'gol'}">${i==='opste'?'opšte — čeka referencu':esc(i)}</span>`).join('')}
      </li>`;
    }).join('');
    napomena.textContent=`${izvori.length} izvora · ${hron.length} događaja · izvor: data/IZVORI.jsonl, data/HRONOLOGIJA.jsonl`;
    if(location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'center'});
  }catch(e){
    napomena.textContent='Registri se čitaju preko HTTP-a (GitHub Pages ili lokalni server); otvaranje sa diska ne može da učita data/*.jsonl.';
  }
})();
