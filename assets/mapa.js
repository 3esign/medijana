const EMBED = new URLSearchParams(location.search).has('embed');
if(EMBED){for(const s of ['.hdr','.traka-mape','.skip'])document.querySelector(s)?.style.setProperty('display','none');}

const esc=s=>MED.esc(s);
const boja=(ime,pad)=>getComputedStyle(document.documentElement).getPropertyValue(ime).trim()||pad;
async function jsonl(p){return MED.jsonl(p);}

const osnovna = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {maxZoom:19, attribution:'&copy; OpenStreetMap', className:'osnovna-ploce'});
const satelit = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {maxZoom:19, attribution:'Esri World Imagery'});
const mapa = L.map('mapa',{layers:[osnovna], zoomControl:!EMBED});
L.control.layers({'Karta (OSM)':osnovna,'Satelit (Esri)':satelit},{},{position:'topright'}).addTo(mapa);

const BOJA_TIP = () => ({jezgro:boja('--d2','#d7a24a'), grad:boja('--d1','#8fba8c'),
  carski_kompleks:boja('--d3','#cf7049'), nekropola:'#8d7fb3'});
const BOJA_POUZ = () => ({objavljena_dimenzija:boja('--d1','#8fba8c'),
  izvedeno_iz_povrsine:boja('--d2','#d7a24a'), sematski:boja('--d3','#cf7049')});
const TIP_IME = {jezgro:'Medijana — predmet projekta', grad:'antički grad', carski_kompleks:'carski kompleks', nekropola:'nekropola'};

const slojRegion = L.layerGroup(), slojLokalitet = L.layerGroup();
let lokacije=[], geometrija=[], pogled=null;

function popupLok(r){
  return `<div class="pp"><span class="id">${esc(r.id)}${r.anticko_ime?' · '+esc(r.anticko_ime):''}</span>
    <h3>${esc(r.naziv)}</h3>
    <span class="znak gol">${esc(TIP_IME[r.tip]||r.tip)}</span>
    <span class="znak ${r.preciznost==='priblizno'?'d3':'d2'}">koordinata: ${esc(r.preciznost)}</span>
    <span class="znak gol">${esc(r.period)}</span>
    <p style="margin-top:8px">${esc(r.odnos)}</p>
    <p>${esc(r.napomena)}</p>
    <p><b>Izvori:</b> ${(r.izvori||[]).map(i=>i==='opste'?'opšte poznato — čeka referencu':esc(i)).join(', ')} · <a href="izvori.html">bibliografija</a></p></div>`;
}
function sagradiRegion(){
  slojRegion.clearLayers();
  const TIP=BOJA_TIP();
  for(const r of lokacije){
    const b = TIP[r.tip]||'#888';
    L.circleMarker([r.lat,r.lon],{radius:r.tip==='jezgro'?10:7, color:b, weight:2,
      fillColor:b, fillOpacity:r.preciznost==='priblizno'?.25:.7})
      .bindPopup(popupLok(r),{maxWidth:330})
      .bindTooltip(r.naziv,{direction:'top',offset:[0,-8]})
      .addTo(slojRegion);
    if(r.preciznost==='priblizno')
      L.circle([r.lat,r.lon],{radius:5000,color:b,weight:1,dashArray:'4 6',fill:false}).addTo(slojRegion);
  }
  // Via Diagonalis — šematske prave linije između stanica, ne stvarna trasa puta
  const stanice=['L-SINGIDUNUM','L-VIMINACIUM','L-NAISSUS','L-MEDIJANA','L-REMESIANA','L-SERDICA','L-KONSTANTINOPOLJ']
    .map(id=>lokacije.find(r=>r.id===id)).filter(Boolean).map(r=>[r.lat,r.lon]);
  L.polyline(stanice,{color:TIP.jezgro,weight:2,dashArray:'6 8',opacity:.7})
    .bindTooltip('Via Diagonalis (Via Militaris) — šematska veza stanica, ne stvarna trasa')
    .addTo(slojRegion);
}

// lokalni metri (x ka istoku, z ka jugu — pogled odozgo kao u 3D maketi) → geografske koordinate
const SIDRO=[43.3101,21.9487]; // L-MEDIJANA — vizuelno poravnato sa zaštitnom konstrukcijom vile na satelitskom snimku
const M_LAT=111320, M_LON=111320*Math.cos(SIDRO[0]*Math.PI/180);
function tacka(x,z,cx,cz,rot){
  const a=(rot||0)*Math.PI/180, rx=cx+x*Math.cos(a)-z*Math.sin(a), rz=cz+x*Math.sin(a)+z*Math.cos(a);
  return [SIDRO[0]-rz/M_LAT, SIDRO[1]+rx/M_LON];
}
const pravoug=(x,z,cx,cz,rot,ox=0,oz=0)=>[[-x/2,-z/2],[x/2,-z/2],[x/2,z/2],[-x/2,z/2]].map(([a,b])=>tacka(a+ox,b+oz,cx,cz,rot));
function luk(r,cx,cz,rot,od,doU,ox=0,oz=0,n=20){
  const p=[]; for(let i=0;i<=n;i++){const u=od+(doU-od)*i/n; p.push(tacka(ox+r*Math.cos(u), oz+r*Math.sin(u), cx, cz, rot));}
  return p;
}
function popupGeo(el){
  return `<div class="pp"><span class="id">${esc(el.id)} · ${esc(el.nivo)}</span><h3>${esc(el.naziv)}</h3>
    <span class="znak ${MED.klasa(el.pouzdanost)}">${esc(el.pouzdanost.replace(/_/g,' '))}</span>
    <span class="znak d3">položaj: ${esc(el.polozaj)}</span>
    <p style="margin-top:8px">${esc(el.napomena)}</p>
    <p><b>Izvori:</b> ${(el.izvori||[]).map(esc).join(', ')} · <a href="blizanac.html?element=${encodeURIComponent(el.id)}">3D maketa</a> · <a href="pokrivenost.html?q=${encodeURIComponent(el.id)}">karton</a></p></div>`;
}
function sagradiLokalitet(){
  slojLokalitet.clearLayers();
  const POUZ=BOJA_POUZ();
  for(const el of geometrija.filter(el=>el.prikaz!==false)){
    const b=POUZ[el.pouzdanost]||'#888';
    const stil={color:b,weight:2,fillColor:b,fillOpacity:el.pouzdanost==='sematski'?.18:.32,
      dashArray:el.pouzdanost==='sematski'?'5 5':null};
    const [cx,cz]=el.pos, rot=el.rot_deg||0, D=el.dim, delovi=[];
    switch(el.oblik){
      case 'kutija': delovi.push(L.polygon(pravoug(D.x,D.z,cx,cz,rot),stil)); break;
      case 'prsten': delovi.push(L.polygon([pravoug(D.spolja_x,D.spolja_z,cx,cz,rot),
                                            pravoug(D.unutra_x,D.unutra_z,cx,cz,rot)],stil)); break;
      case 'kolonada_prsten': delovi.push(L.polygon(pravoug(D.x,D.z,cx,cz,rot),
        {color:b,weight:1.5,dashArray:'3 5',fill:false})); break;
      case 'kolonada_dvoredna': delovi.push(L.polygon(pravoug(D.duzina_x, D.razmak_z, cx, cz, rot),
        {color:b,weight:1.5,dashArray:'3 5',fill:false})); break;
      case 'apsida': delovi.push(L.polygon(
        [tacka(-D.dubina,-D.r,cx,cz,rot), ...luk(D.r,cx,cz,rot,-Math.PI/2,Math.PI/2), tacka(-D.dubina,D.r,cx,cz,rot)],stil)); break;
      case 'oktogon': delovi.push(L.polygon(luk(D.r,cx,cz,rot,0,2*Math.PI,0,0,8),stil)); break;
      case 'bazilika': delovi.push(L.polygon(
        [tacka(-D.x/2,-D.z/2,cx,cz,rot), tacka(D.x/2,-D.z/2,cx,cz,rot),
         ...luk(D.r_apside,cx,cz,rot,-Math.PI/2,Math.PI/2,D.x/2,0),
         tacka(D.x/2,D.z/2,cx,cz,rot), tacka(-D.x/2,D.z/2,cx,cz,rot)],stil)); break;
      case 'cilindri_mreza': {
        const kx=(D.po_redu-1)*3.2, kz=(D.redova-1)*4.5;
        for(let r=0;r<D.redova;r++)for(let c=0;c<D.po_redu;c++)
          delovi.push(L.circle(tacka(-kx/2+c*3.2,-kz/2+r*4.5,cx,cz,rot),
            {radius:D.precnik_m/2,color:b,weight:1,fillColor:b,fillOpacity:.3}));
        break; }
      case 'ravan': delovi.push(L.polygon(pravoug(D.x,D.z,cx,cz,rot),
        {color:boja('--l3','#555'),weight:1,dashArray:'2 6',fill:false})); break;
    }
    for(const d of delovi) d.bindPopup(popupGeo(el),{maxWidth:330}).bindTooltip(el.naziv,{direction:'top'}).addTo(slojLokalitet);
  }
}

const legenda=L.control({position:'bottomright'});
legenda.onAdd=()=>L.DomUtil.create('div','leg');
if(!EMBED) legenda.addTo(mapa);
function legHTML(){
  const T=BOJA_TIP(), P=BOJA_POUZ();
  return pogled==='region'
    ? `<b>Povezane lokacije</b>
       <div class="r"><span class="sw" style="background:${T.jezgro}"></span>Medijana — predmet projekta</div>
       <div class="r"><span class="sw" style="background:${T.grad}"></span>antički grad</div>
       <div class="r"><span class="sw" style="background:${T.carski_kompleks}"></span>carski kompleks</div>
       <div class="r"><span class="sw" style="background:${T.nekropola}"></span>nekropola</div>
       <div class="r">isprekidana linija: Via Diagonalis (šematski)</div>
       <div class="r">isprekidan krug: približna koordinata</div>`
    : `<b>Poreklo mere — isto kao u 3D</b>
       <div class="r"><span class="sw sq" style="background:${P.objavljena_dimenzija}"></span>objavljena dimenzija</div>
       <div class="r"><span class="sw sq" style="background:${P.izvedeno_iz_povrsine}"></span>izvedeno iz površine</div>
       <div class="r"><span class="sw sq" style="background:${P.sematski}"></span>šematski — čeka plan</div>`;
}

function prikazi(koji){
  pogled=koji;
  document.getElementById('btnRegion').classList.toggle('on',koji==='region');
  document.getElementById('btnLokalitet').classList.toggle('on',koji==='lokalitet');
  document.getElementById('upozorenje').style.display=koji==='lokalitet'?'block':'none';
  slojRegion.remove(); slojLokalitet.remove();
  if(koji==='region'){
    slojRegion.addTo(mapa);
    if(mapa.hasLayer(satelit)){mapa.removeLayer(satelit);osnovna.addTo(mapa);}
    const sve=lokacije.map(r=>[r.lat,r.lon]);
    if(sve.length) mapa.fitBounds(sve,{padding:[36,36]});
  }else{
    slojLokalitet.addTo(mapa);
    if(mapa.hasLayer(osnovna)){mapa.removeLayer(osnovna);satelit.addTo(mapa);}
    mapa.setView(SIDRO,17);
  }
  if(!EMBED) legenda.getContainer().innerHTML=legHTML();
  if(location.hash.slice(1)!==koji) history.replaceState(null,'','#'+koji);
}
document.getElementById('btnRegion').onclick=()=>prikazi('region');
document.getElementById('btnLokalitet').onclick=()=>prikazi('lokalitet');

// tema menja i boje na mapi: jedan sistem, ne druga paleta
new MutationObserver(()=>{ if(!lokacije.length) return;
  sagradiRegion(); sagradiLokalitet();
  if(!EMBED) legenda.getContainer().innerHTML=legHTML();
}).observe(document.documentElement,{attributes:true,attributeFilter:['data-tema']});

(async()=>{
  const st=document.getElementById('status');
  try{
    [lokacije,geometrija]=await Promise.all([jsonl('data/LOKACIJE.jsonl'),jsonl('data/GEOMETRIJA.jsonl')]);
    sagradiRegion(); sagradiLokalitet();
    prikazi(location.hash.slice(1)==='lokalitet'?'lokalitet':'region');
  }catch(e){
    mapa.setView(SIDRO,8);
    st.style.display='block';
    st.textContent='Registri se čitaju preko HTTP-a (GitHub Pages ili lokalni server) — otvaranje sa diska ne može da učita data/*.jsonl.';
  }
})();
