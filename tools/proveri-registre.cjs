const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const registers={};
for(const file of fs.readdirSync(path.join(root,'data')).filter(f=>f.endsWith('.jsonl'))){
 const records=fs.readFileSync(path.join(root,'data',file),'utf8').trim().split(/\r?\n/).filter(Boolean).map((s,i)=>{try{return JSON.parse(s)}catch(e){throw Error(`${file}:${i+1}: ${e.message}`)}});
 const ids=new Set();for(const row of records){const id=file==='RECNIK.jsonl'?row.term:row.id;assert(id,`${file}: missing key`);assert(!ids.has(id),`${file}: duplicate ${id}`);ids.add(id);}registers[file.replace('.jsonl','')]=records;
}
const {GEOMETRIJA:g,IZVORI:s,VEZE_IZVORA:links,HIPOTEZE:h}=registers;
const sourceIds=new Set(s.map(r=>r.id)),hypothesisIds=new Set(h.map(r=>r.id));
for(const link of links){assert(sourceIds.has(link.candidate),`missing candidate ${link.candidate}`);assert(['kandidat','blokirano','potvrdjena_veza'].includes(link.status),`unreviewed status ${link.id}`);assert(link.basis&&link.note&&link.checked_at);}
for(const row of g){assert(row.izvori.every(id=>links.some(x=>x.id===id)),`missing source mapping ${row.id}`);for(const id of row.hipoteze||[])assert(hypothesisIds.has(id),`missing hypothesis ${id}`);assert(row.pos.length===2&&row.pos.every(Number.isFinite));}
const {analyze}=require('../assets/pokrivenost-core.js');
const result=analyze(g,s,links);
assert(result.every(r=>r.references.every(ref=>ref.exists)));
// A missing source must remain unresolved; a bibliographic conflict must block measurements.
assert.equal(analyze([{izvori:['UNKNOWN']}],[],[])[0].references[0].status,'nerazreseno');
assert(result.find(r=>r.id==='G-OKTOGON').tasks.some(t=>t.includes('neusaglašenost')));
assert.equal(g.find(r=>r.id==='G-OKTOGON').prikaz,false,'Disputed site identity must stay excluded');
for(const row of s){for(const id of row.verification?.related_sources||[])assert(sourceIds.has(id));}
for(const link of links){for(const id of link.evidence||[])assert(sourceIds.has(id));}
const glb=fs.readFileSync(path.join(root,'modeli','medijana.glb'));
const gltf=JSON.parse(glb.subarray(20,20+glb.readUInt32LE(12)).toString());
assert(!gltf.nodes.some(n=>(n.name||'').includes('G-OKTOGON')),'GLB must exclude disputed octagon');
console.log(JSON.stringify({registers:Object.keys(registers).length,records:Object.values(registers).reduce((n,r)=>n+r.length,0),geometry:result.length,candidateLinks:links.length,schematicPositions:g.filter(r=>r.polozaj==='sematski').length}));
