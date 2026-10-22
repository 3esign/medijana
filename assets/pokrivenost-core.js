/* Coverage describes registry metadata, never archaeological certainty. */
(function(root){
  'use strict';
  function analyze(geometry, sources, links){
    const sourceIds=new Set(sources.map(s=>s.id));
    return geometry.map(g=>{
      const references=(g.izvori||[]).map(id=>{
        const link=links.find(l=>l.id===id);
        return {id,candidate:link?.candidate || null,status:link?.status || 'nerazreseno',note:link?.note || 'Nema mape povezivanja.',exists:sourceIds.has(link?.candidate)};
      });
      const tasks=[];
      if(g.polozaj==='sematski') tasks.push('Pribaviti plan sa razmerom, orijentacijom, koordinatnim sistemom i kontrolnim tačkama.');
      if(g.pouzdanost!=='objavljena_dimenzija') tasks.push('Zameniti procenjene dimenzije merama iz identifikovanog crteža ili snimka.');
      else tasks.push('Potvrditi prenete dimenzije tačnom stranom i oznakom crteža u originalu.');
      if(references.some(r=>r.status==='blokirano')) tasks.push('Razrešiti prijavljenu bibliografsku neusaglašenost pre izvlačenja mera.');
      tasks.push('Dokumentovati poreklo visina i dozvolu korišćenja podataka; zatražiti stručnu proveru.');
      return {...g,references,tasks};
    });
  }
  const api={analyze};
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.MedijanaCoverage=api;
})(typeof globalThis==='object'?globalThis:this);
