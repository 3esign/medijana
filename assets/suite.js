/* Medijana — zajednicko ponasanje suite-a: zaglavlje, meni, stanje teme, citanje registara.
   Bez zavisnosti. Stranice rade i bez ovog fajla (navigacija je staticki HTML). */
(function () {
  'use strict';
  var KLJUC = 'medijana-tema';
  var doc = document.documentElement;
  var en = doc.lang === 'en';
  doc.classList.add('avec-js');

  /* ---- tema: teren (tamno) / arhiv (papir) ---- */
  function postavi(t, upisi) {
    doc.dataset.tema = t;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'arhiv' ? '#f3f1ec' : '#0c0c0b');
    var b = document.getElementById('tema-dugme');
    if (b) {
      var naArhiv = t === 'teren';
      b.setAttribute('aria-label', en ? (naArhiv ? 'Switch to light theme' : 'Switch to dark theme') : (naArhiv ? 'Pređi na svetlo (arhiv)' : 'Pređi na tamno (teren)'));
      b.setAttribute('title', b.getAttribute('aria-label'));
      b.innerHTML = naArhiv ? IKONA.sunce : IKONA.mesec;
    }
    if (upisi) { try { localStorage.setItem(KLJUC, t); } catch (e) {} }
  }

  var IKONA = {
    sunce: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>',
    mesec: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 13.4A8.2 8.2 0 0 1 10.6 4a8.2 8.2 0 1 0 9.4 9.4z"/></svg>',
    meni: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    zatvori: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  var hdr = document.querySelector('.hdr');
  var nav = hdr && hdr.querySelector('nav');
  var alat = hdr && hdr.querySelector('.hdr-alat');

  if (alat) {
    var tema = document.createElement('button');
    tema.id = 'tema-dugme'; tema.type = 'button'; tema.className = 'dugme-ikona';
    tema.addEventListener('click', function () {
      postavi(doc.dataset.tema === 'arhiv' ? 'teren' : 'arhiv', true);
    });
    alat.insertBefore(tema, alat.firstChild);

    if (nav) {
      var meni = document.createElement('button');
      meni.type = 'button'; meni.className = 'dugme-ikona meni-dugme';
      meni.setAttribute('aria-controls', nav.id || (nav.id = 'glavna-navigacija'));
      meni.setAttribute('aria-expanded', 'false');
      meni.setAttribute('aria-label', en ? 'Open navigation' : 'Otvori navigaciju');
      meni.innerHTML = IKONA.meni;
      function stanjeMenija(otvoren) {
        doc.dataset.meni = otvoren ? '1' : '0';
        meni.setAttribute('aria-expanded', String(otvoren));
        meni.setAttribute('aria-label', en ? (otvoren ? 'Close navigation' : 'Open navigation') : (otvoren ? 'Zatvori navigaciju' : 'Otvori navigaciju'));
        meni.innerHTML = otvoren ? IKONA.zatvori : IKONA.meni;
      }
      meni.addEventListener('click', function () { stanjeMenija(doc.dataset.meni !== '1'); });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) stanjeMenija(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.dataset.meni === '1') { stanjeMenija(false); meni.focus(); } });
      addEventListener('resize', function () { if (innerWidth > 1040 && doc.dataset.meni === '1') stanjeMenija(false); });
      alat.appendChild(meni);
      stanjeMenija(false);
    }
  }
  postavi(doc.dataset.tema === 'arhiv' ? 'arhiv' : 'teren', false);

  if (hdr) {
    var plovi = function () { hdr.classList.toggle('plovi', scrollY > 6); };
    addEventListener('scroll', plovi, { passive: true });
    plovi();
  }

  /* ---- zajednicki alat za registre ---- */
  var kes = {};
  window.MED = {
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    },
    jsonl: function (put) {
      if (!kes[put]) kes[put] = fetch(put).then(function (r) {
        if (!r.ok) throw new Error(put + ' — HTTP ' + r.status);
        return r.text();
      }).then(function (t) {
        return t.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return JSON.parse(l); });
      }).catch(function (e) { delete kes[put]; throw e; });
      return kes[put];
    },
    // klasa dokaza -> znak po konvenciji crteza
    klasa: function (p) {
      return p === 'objavljena_dimenzija' ? 'd1' : p === 'izvedeno_iz_povrsine' ? 'd2' : p === 'sematski' ? 'd3' : 'dx';
    }
  };
})();
