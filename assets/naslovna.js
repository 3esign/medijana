/* Naslovna — sve brojke, udeli i osa citaju se uzivo iz data/*.jsonl.
   Kad citanje ne uspe (otvaranje sa diska), brojevi ostaju "—" i to se kaze.
   3D pregled u prvom ekranu vodi assets/scena.js, nezavisno od ovog fajla. */
(function () {
  'use strict';
  var E = MED.esc;
  var en = document.documentElement.lang === 'en';
  var REG = ['GEOMETRIJA', 'HIPOTEZE', 'HRONOLOGIJA', 'IZVORI', 'KONTRADIKCIJE',
    'LOKACIJE', 'NIVOI', 'PITANJA', 'RECNIK', 'VEZE_IZVORA'];

  Promise.all(REG.map(function (r) { return MED.jsonl('data/' + r + '.jsonl'); }))
    .then(function (nizovi) {
      var D = {};
      REG.forEach(function (r, i) { D[r] = nizovi[i]; });
      var zapisa = nizovi.reduce(function (s, n) { return s + n.length; }, 0);

      var geom = D.GEOMETRIJA;
      var prikazani = geom.filter(function (g) { return g.prikaz !== false; });
      var iskljuceni = geom.length - prikazani.length;

      var brojevi = {
        geometrija: prikazani.length,
        izvori: D.IZVORI.length,
        hipoteze: D.HIPOTEZE.length,
        lokacije: D.LOKACIJE.length,
        zapisi: zapisa,
        kartoni: geom.length,
        istrazivanje: D.HIPOTEZE.length + D.PITANJA.length + D.KONTRADIKCIJE.length
      };
      Object.keys(brojevi).forEach(function (k) {
        document.querySelectorAll('[data-broj="' + k + '"]').forEach(function (el) { el.textContent = brojevi[k]; });
        document.querySelectorAll('[data-znak="' + k + '"]').forEach(function (el) {
          el.textContent = brojevi[k] + ' ' + el.textContent.replace(/^—\s*/, '');
        });
      });

      /* --- traka dokaza --- */
      var klase = [
        ['objavljena_dimenzija', 's1', en?'published dimension':'objavljena mera'],
        ['izvedeno_iz_povrsine', 's2', en?'derived dimension':'izvedeno iz objavljenog podatka'],
        ['sematski', 's3', en?'schematic — awaiting plans':'šematsko — čeka plan']
      ];
      var traka = document.getElementById('traka-dokaza');
      var delovi = klase.map(function (k) {
        return { kod: k[0], cls: k[1], ime: k[2], n: prikazani.filter(function (g) { return g.pouzdanost === k[0]; }).length };
      });
      if (iskljuceni) delovi.push({ kod: 'iskljuceno', cls: 'sx', ime: en?'disputed — excluded':'sporno — izvan prikaza', n: iskljuceni });
      var ukupno = delovi.reduce(function (s, d) { return s + d.n; }, 0) || 1;
      if (traka) {
        traka.innerHTML = delovi.filter(function (d) { return d.n; }).map(function (d) {
          return '<span class="' + d.cls + '" style="width:' + (d.n / ukupno * 100).toFixed(2) + '%" ' +
            'title="' + E(d.ime) + ': ' + d.n + '"></span>';
        }).join('');
        traka.setAttribute('aria-label', (en?'Evidence classes: ':'Klase dokaza u registru geometrije: ') +
          delovi.map(function (d) { return d.ime + ' ' + d.n; }).join(', '));
      }
      delovi.forEach(function (d) {
        var el = document.querySelector('[data-udeo="' + d.kod + '"]');
        if (el) el.textContent = d.n + ' / ' + geom.length + ' · ' + Math.round(d.n / geom.length * 100) + '%';
      });
      var tn = document.getElementById('traka-note');
      if (tn) tn.innerHTML = geom.length + (en?' elements in ':' elemenata u ')+'<a class="veza" href="data/GEOMETRIJA.jsonl">GEOMETRIJA.jsonl</a>' +
        (iskljuceni ? ' · ' + iskljuceni + (en?' excluded due to disputed identity':' izvan prikaza zbog spornog identiteta') : '') + '.';

      /* --- nivoi N0–N6 --- */
      var nivoi = document.getElementById('nivoi');
      if (nivoi) nivoi.innerHTML = D.NIVOI.map(function (n) {
        return '<div class="nivo"><span class="n">' + E(n.id) + '</span>' +
          '<span class="i">' + E(n.ime) + '</span><span class="r">' + E(n.razmera) + '</span></div>';
      }).join('');

      /* --- osa --- */
      var ZNAK = { PO_IZVORU: ['d1', 'po izvoru'], OPSTE_PRIHVACENO: ['d2', 'opšte prihvaćeno'], NEPROVERENO: ['d3', 'neprovereno'] };
      var osa = document.getElementById('osa-kratka');
      if (osa) osa.innerHTML = D.HRONOLOGIJA.map(function (h) {
        var z = ZNAK[h.status] || ['dx', String(h.status || '').toLowerCase().replace(/_/g, ' ')];
        return '<li><span class="god">' + E(h.prikaz) + '</span>' +
          '<span class="dog">' + E(h.dogadjaj) + '<em>' + E(h.napomena || '') + '</em></span>' +
          '<span class="znak ' + z[0] + '">' + E(z[1]) + '</span></li>';
      }).join('');
    })
    .catch(function (e) {
      var n = document.getElementById('brojke-note');
      if (n) n.textContent = en ? 'Registry data could not be loaded. Reload the page to try again; the spatial preview remains available.' : 'Podaci registra trenutno nisu dostupni. Osveži stranicu za novi pokušaj; prostorni pregled ostaje dostupan.';
      ['nivoi', 'osa-kratka', 'traka-dokaza'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.remove();
      });
    });
})();
