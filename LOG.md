# Radni trag

2026-10-22 · Istraživački sto: pretraga/filteri, JSON izvoz, veze na 3D, predlog paketa za Institut. Postojeći registri ostaju nepromenjeni. Checkout je nastavak iste Git istorije unutar dozvoljenog korena C.

Lekcija: A-MEDIJANA-* i MED-* su različiti sistemi identifikatora; broj nije dokaz iste publikacije. Potrebna je proverena mapa povezivanja.

Sledeće: proveriti original reference za oktogon, uskladiti identifikatore literature i uvesti georeferencirani plan sa dozvolom korišćenja.

2026-10-22 · Pokrivenost: kartoni deset elemenata, kandidati pet bibliografskih veza, status oktogona blokirano za mere, plan prostornog pilota. Sve postojeće mere sačuvane.

Lekcija: odvojiti poreklo dimenzija od tačnosti položaja i visine. Lokalno slaganje metapodataka dozvoljava samo kandidatsku vezu; ne potvrđuje sadržaj originala.

Dizajn / honest-verdict: rečenica — šta model zna i šta tražimo; brojevi iz registara; izostavljen procenat naučne pouzdanosti; redosled sažetak → kartoni → naredni dokaz; bez animacija i dekorativnih efekata; semantičke kontrole, lokalni CSS/JS, izvorni registri kao fallback. Vizuelne i funkcionalne provere u sesijskom izveštaju.

2026-10-22 · Proveren original MED-11, str. 247–250; MED-05 ostaje nepotvrđen. G-OKTOGON zadržan u registru, isključen iz prostornih prikaza. Lekcija: podudaranje naziva građevine ne potvrđuje lokalitet. Sledeće: tačna strana/planski dokaz za horreum; zatim identitet ostalih referenci.

Provera: 108 zapisa; 15 postojećih i 4 ciljane browser provere; Blender izvoz sa 9 elemenata i kontrola GLB čvorova. Render pregledan. Mere ostaju šematske/prenete, planovi nisu georeferencirani, PDF crteži nisu vizuelno provereni.

2026-10-22 · Ukrštena provera MED-12 (Wikipedia, tercijarno): vila 98,6×63 m potvrđena → G-VILA prelazi u objavljena_dimenzija; horreum 91×27 m ~150 m zapadno, osovina I–Z, baseni 1,40 m uz zapadni zid (podrška M-H09); terme SZ od vile i nimfej uz istočni trakt potvrđeni opisno. Novi element G-KASTELUM (castellum aquae, 10 m visinske razlike, veza M-H05) preko A-MEDIJANA-06. MED-12 ostaje tercijarni izvor sa ogranicenjem — ne zamenjuje originalnu monografiju.

Lekcija: kamera u Blenderu ima podrazumevani clip_end 100 m — scena veličine nekoliko stotina metara se iz pozicije od ~1,5 km renderuje kao prazna pozadina. Kadriranje se sada računa iz ograničavajuće kugle scene sa vertikalnim FOV od 11,4° (50 mm na 1600×900), a provera kadrovanja ide piksel-skanom (bounding box sadržaja), ne vizuelnim modelom.

Provera: 111 zapisa, validator prolazi; GLB i render regenerisani iz 10 prikazanih elemenata; sadržaj rendera u 32–67% širine i 32–74% visine, margine ≥20 px sa svih strana. Sledeće: originalni plan monografije (MED-04) za unutrašnjost horreuma; zatim identitet ostalih A-MEDIJANA-* referenci.

2026-10-22 · Horreum unutrašnja artikulacija i identitet MED-04: Petrović 1994 monografija (SANU/AI/NM) razdvojena od kataloške studije 1993; potvrđena trobrodna unutrašnja struktura sa dva reda nosivih stubaca, cella vinaria sa zidanim bazenima 1,40 m uz zapadni zid i južni pokriveni trem sa rampom za zaprege. Novi elementi G-HORREUM-BASENI i G-HORREUM-TREM dodati u GEOMETRIJA.jsonl sa statusom objavljena_dimenzija (N1, A-MEDIJANA-02, M-H09). Ažurirani G-HORREUM i G-DOLIA.

Lekcija: publikacije istog autora iz bliskih godina (1993 katalog vs 1994 monografija) mogu nositi različite nivoe arhitektonske rezolucije. Tek monografija donosi operativne nacrte i unutrašnju artikulaciju prostora (trem, bazeni, trobrodni stubci).

Provera: 113 zapisa u 10 registara, validator tools/proveri-registre.cjs prolazi čisto (13 geometrijskih elemenata, 123 GLTF čvora); Blender headless regenerisao medijana.glb i blizanac-render.png iz 12 prikazanih elemenata (G-OKTOGON ostaje isključen); piksel-skan rendera potvrđuje kadar u 32.0–66.6% širine i 26.1–68.0% visine sa marginama ≥235 px. Sledeće: georeferencirani geodetski plan za tačan raspored stubaca unutar trobrodnog horreuma i usklađivanje preostalih bibliografskih veza.


2026-10-23 · Trobrodna kolonada horreuma, potvrđene bibliografske veze i međunarodni dvojezični portal:
- Geometrija: dodat element `G-HORREUM-STUBOVI` (2 podužna reda po 12 nosivih stubaca/pilona duž glavne dvorane horreuma, pos=[-146, 25], duzina=75 m, razmak_z=9 m koji deli skladište na tri broda širine po 9 m prema Petrović 1994, MED-04). Implementirana podrška za `kolonada_dvoredna` u Three.js (`blizanac.html`), mapi (`mapa.html`) i Blender skripti (`blizanac_blender.py`).
- Bibliografija i veze: u `VEZE_IZVORA.jsonl` promovisane ključne veze u status `potvrdjena_veza` na osnovu identitetske mape iz `06_HIPOTEZE_I_PITANJA.md`: A-MEDIJANA-01 ↔ MED-07 (Milošević 2016, T1 referentna monografija za vilu, mozaike, terme i nimfej), A-MEDIJANA-02 ↔ MED-04 (Petrović 1994, T2 monografija sa planom skladišta), A-MEDIJANA-04 ↔ MED-01 (Vasić 1936, T3 stibadijum). A-MEDIJANA-03 ↔ MED-05 ostaje `blokirano` (sporan lokalitet, Gradsko polje).
- Dvojezičnost i alati: kreiran `index-en.html` kao portal za međunarodne istraživače i konzorcijume (Horizon Europe, Creative Europe), usklađen sa Londonskom poveljom i Seviljskim principima; ažurirana navigacija na svih 8 stranica; u `blizanac.html` dodato dugme za direktno preuzimanje GLB makete.
- Provera: `tools/proveri-registre.cjs` prolazi (10 registara, 114 zapisa, 14 geometrijskih elemenata, 6 veza); Blender headless generisao `modeli/medijana.glb` (148 GLTF čvorova) i `assets/blizanac-render.png` (1600×900, 1.35 MB); verifikovano odsustvo spornog oktogona.
- Lekcija: Prenošenje unutrašnjeg pilona/stubnog rastera trobrodnog skladišta povezuje skladišne dolije (dolia defossa) sa nosećom arhitekturom krova, čime se apstraktna kutija pretvara u funkcionalni kasnoantički horreum pre terenskog laserskog skeniranja.
- Sledeće: georeferencirani geodetski plan za apsolutne koordinate stubaca i vile; priprema paketa za prvi radni sastanak sa Institutom pred prebacivanje repoa na public.


2026-10-23 · Antički primarni izvor (Amijan Marcelin), razrešenje KR-01 i paket za saradnju sa Institutom:
- Antički primarni izvor: verifikovan izvorni latinski tekst i glava Amijana Marcelina (Res Gestae XXVI, 5, 1: „in suburbano, quod appellatur Mediana, tertio lapide discreto ab urbe, partiti sunt comites...“); unet MED-13 u data/IZVORI.jsonl (talas 0); hronološki zapis HR-04 promovisan u status PO_IZVORU sa vezom na MED-13; ažuriran izvori.html sa talasom 0 antičkih narativnih izvora.
- Registri: KR-01 („Horreum sa dolia“) razrešen u status RAZRESENO na osnovu nalaza pregrađene cella vinaria sa zidanim bazenima dubine 1,40 m (Petrović 1994, G-HORREUM-BASENI); potvrđena kombinovana namena skladištenja žita i tečnosti (vino i ulje); biohemijski test ostaje u okviru M-H09.
- Institucionalni paket: kreiran docs/07_PROTOKOL_I_RADNI_PAKET_INSTITUT.md kao operativni memorandum za Arheološki institut Beograd i Narodni muzej Niš (geodetski CRS zahtevi MGI Z7 / UTM 34N, apsolutne kote, trostepeni režim embarga i autorstva, pilot Stibadijuma u P2 i priprema za Horizon/Creative Europe).
- Provera: tools/proveri-registre.cjs prolazi čisto (10 registara, 115 zapisa, 14 geometrijskih elemenata, 6 veza); integritet GLB-a potvrđen (odsustvo spornog oktogona).
- Lekcija: Uspostavljanje jasnih pravila o podacima pod embargom štiti primarne terenske istraživače i otvara vrata institucionalne saradnje bez straha od prevremenog objavljivanja nalaza.
- Sledeće: zakazivanje prvog sastanka sa rukovodstvom Instituta i preuzimanje prve probne geodetske DWG podloge za pilot Stibadijuma.


## Provera, pročišćavanje i priprema objave · 23.10.2026.

**Ispravka zatečenog nalaza.** Prvi pregled je pokazao da commit-ovi `104439d` i `3695803` ne postoje i da su registri na 113 zapisa. To je bilo pogrešno: lokalni `origin/main` bio je nesvež. Posle `git fetch` oba commit-a su tu, zajedno sa `G-HORREUM-STUBOVI`, `MED-13`, `index-en.html` i `docs/07`; registri stoje na **115 zapisa, 14 geometrijskih elemenata (13 prikazanih)**. Pouka: pre tvrdnje o stanju grane — `git fetch`, ne `git log origin/main` nad starim refom.

**Nova provera suite-a** (`tools/proveri-suite.cjs`): skelet svake od 8 stranica (lang, charset, viewport, title), social/SEO blok, tačan kanonski URL, uzajamni `hreflang` srpski ↔ engleski, navigacija (isti redosled svuda, tačno jedan `aria-current`, pokriva sve stranice), postojanje svih 122 lokalne putanje u HTML-u i 47 u Markdown-u, infrastruktura objave, i tvrdnja da nijedna javna veza ne vodi u `docs/private/`.

**Usaglašeno.** `charset` i `viewport` bili su u dva oblika — svedeno na jedan. Navigacija je imala tri različita redosleda, a `blizanac.html` uopšte nije imao `<nav>` (linkovi su stajali goli u HUD zaglavlju, bez razmaka i bez semantike). `tools/uskladi-navigaciju.cjs` sada generiše isti redosled na svih 8 stranica, sa engleskim natpisima na EN portalu. `tools/pripremi-launch.cjs` upisuje jedinstven meta blok (description, canonical, Open Graph, Twitter card, hreflang, theme-color, favicon) i izvodi `sitemap.xml` iz istog spiska, da ne može da odluta. Oba alata rade nad LF i vraćaju CRLF pri upisu, pa izmena ostaje mala umesto celog fajla.

**Dodato za objavu.** `LICENSE` (MIT, kod) i `LICENSE-CONTENT` (CC BY 4.0, sadržaj — sa izgovorenim izuzecima: autorska prava izvornih istraživača, vlasništvo ustanova nad nalazima, zabrana objave neobjavljenog iz tekućih kampanja). `.zenodo.json`, `favicon.svg`, `404.html` (noindex, puna navigacija), `robots.txt`, `sitemap.xml`, `.nojekyll`, `.gitignore`, `.github/workflows/pages.yml` (Pages se ne isporučuje ako provera padne), `docs/08_LAUNCH.md`.

**Pročišćeno.** Dve stvari izdvojene iz javnog dela u `docs/private/`: pregovaračka priprema („zlatno pravilo prvog kontakta“) iz `docs/03`, i ceo protokol za Institut (`docs/07`) — neposlat predlog imenovanim ustanovama sa specifikacijom traženih podataka i predloženim režimom prava i embarga. README o njemu govori, ali ga ne vezuje; objava tek po pristanku institucija. Ponuda saradnje u README-u preformulisana bez pregovaračkog tona, uz izričito mesto licence.

**Vizuelna provera.** Headless snimak na `--window-size=390,900` pokazao je isečen raspored i delovao kao mobilni preliv — to je **artefakt headless režima**: bez emulacije uređaja Chrome ignoriše viewport meta i seče desktop raspored. Merodavna provera kroz iframe širine 390px daje `scrollWidth=390` na svih 9 stranica, bez preliva; navigacija se prelama u dva reda i čitljiva je. Alat ostaje u `tools/provera/`, snimci u `data/sessions/c1792693315645azrt/artifacts/launch/`.

**Granice.** Oba validatora prolaze, ali strukturna ispravnost nije arheološka validacija. Repozitorijum ostaje privatan — tri koraka objave (odluka o istoriji, public + Pages, release sa Zenodo DOI) čekaju Semira i opisani su u `docs/08_LAUNCH.md`.

## 2026-10-23 — LAUNCH izvrsen

- `git push --force origin launch-p1:main` → `28e73bd`, jedan commit, istorija bez `docs/private/` i bez `07_PROTOKOL`.
- Repo vidljivost: **PUBLIC** (`gh repo edit --visibility public`).
- Pages: `build_type=workflow`, `https://3esign.github.io/medijana/` — Actions deploy prosao.
- Tag `v0.1-p1` + release objavljen: https://github.com/3esign/medijana/releases/tag/v0.1-p1
- Validator u CI: `Validate research registries` success na `main` i na tagu.
- Smoke-test uzivo (HTTP 200): `/`, `index-en.html`, `blizanac.html`, `mapa.html`, `registri.html`, `izvori.html`, `404.html`, `robots.txt`, `sitemap.xml`, `data/GEOMETRIJA.jsonl`. `docs/private/` → 404.
- Javni `docs/03` sadrzi samo javno objavljive brojke (programski rasponi fondova, kapitalni projekat 9,7 mil. RSD iz javnih izvestaja); pregovaracki `03a_PRVI_KONTAKT` i ceo `07` ostaju u `docs/private/` (gitignore).
- **Otvoreno — Zenodo DOI:** zahteva rucno ukljucivanje repoa na zenodo.org/account/settings/github (OAuth, ne moze preko tokena). Posle toga: obrisati i ponovo objaviti release ili napraviti `v0.1-p1.1` da webhook uhvati, pa DOI uneti u `CITATION.cff`, `README.md`, `.zenodo.json`.

## 2026-10-23 · Zenodo DOI

Zenodo GitHub integracija uključena (Semir). Webhook `701866193` (event `release`) potvrđen aktivnim.
Release `v0.1-p1` obrisan i ponovo napravljen da webhook uhvati `release.published` — deposition prošla, `state: done`.

- **Concept DOI (uvek poslednja verzija): `10.5281/zenodo.23580526`**
- Verzija v0.1-p1: `10.5281/zenodo.23580527` — https://zenodo.org/records/23580527

DOI unet u `CITATION.cff` (`doi:` + oba `identifiers`), `.zenodo.json` (`isVersionOf`), `README.md` (badge + red o citiranju),
footer `index.html` i `index-en.html`. Oba validatora prolaze: registri `{10,115,14}`, suite `{8,122,47,nav ok,publish ok}`.

Granica: Zenodo zapis nosi ono što je bilo u tagu `v0.1-p1`; sadržaj ovog commita nije u DOI-ju v0.1-p1 dok ne izađe sledeći tag.

2026-10-23 · Vizuelni jezik: ceo suite prebačen na jedan dizajn-sistem (assets/medijana.css, assets/suite.js, tools/uskladi-skelet.cjs). Zlatno-braon „antička“ paleta zamenjena konvencijom arheološkog crteža (puno / tonirano / šrafirano / tačkasto); dve teme teren+arhiv; self-hosted Inter i Source Serif 4 (OFL); naslovna čita sve brojke uživo iz registara; zaglavlje jedno za svih 9 stranica, sa fiokom ispod 1040 px.

Lekcija: tri stranice su imale tri različita zaglavlja, a 3D prikaz nije imao `<nav>` uopšte — zato skelet sada ima jednog vlasnika (alat), a provera traži markere, zajednički CSS/JS i odsustvo stare palete.

Lekcija (JS): `defer` skripta se izvršava posle svake inline skripte u telu dokumenta. Inline skripte stranica su zato pozivale `MED` pre nego što `assets/suite.js` postoji i tiho padale u poruku „registri se čitaju preko HTTP-a“. Izdvojene su u assets/registri.js, assets/izvori.js, assets/mapa.js sa `defer`.

Sledeće: peti znak konvencije — „mereno na terenu“ — ulazi tek sa geodetskim planom u P2.

2026-10-23 · Design continuation: replaced the overlapping hero backdrop with a dedicated 3D/plan instrument on both landing pages. Completed projection-based camera framing, object selection and reset, compact mobile controls, on-demand rendering and GPU resource disposal. Removed automatic rotation and the warm terrain tint; improved secondary text contrast. A static image remains until the renderer confirms readiness, including CDN failure. Browser verification: 126 checks across all eight routes, three page widths and five camera formats; three visual review passes. Registries remain unchanged: 115 records, 14 geometry entries. Archaeological source claims were not re-audited; physical mobile devices and Safari were not tested.

Design lesson: fit the visible projected geometry inside the available screen area; a world-space bounding sphere and an iframe load event are insufficient evidence for a usable model preview. Disable the browser cache during verification to avoid measuring an older stylesheet. The next substantive model improvement still requires verified survey geometry.

## 2026-10-23 · Pilot attribution and copy review

Reviewed visible copy across all eight pages. Replaced design slogans with a short data legend and concrete descriptions. The landing pages now introduce the project pilot within the collaboration with the Institute of Archaeology, signed by doc. dr Bojan Končarević and doc. dr Poturak Semir, Union – Nikola Tesla University, Faculty of Construction Management, following Semir's instruction of 23 October. Updated README, institutional overview, current citation file and next-deposit Zenodo metadata. This does not update the previously archived Zenodo release or assert institutional review of the model.

Checks: registry and suite validators; 16 page/viewport checks (390 and 1440 px), no overflow or JavaScript exceptions; Serbian and English landing and legend screenshots reviewed. Fixed anchor offset beneath the sticky header. Archaeological records and geometry were not revalidated in this editorial pass.

Editorial rule: describe purpose, people, phase and next action; omit self-praise, design manifestos and contrived contrasts. Keep factual limitations. The general rule was added to the Svemir canon. Next: agree the initial building, source plans and review scope with collaborators.

Design review: purpose is the collaboration pilot; source counts remain data-driven; removed slogans and oversized legend swatches; hierarchy is site, pilot/authors, model; no new motion; layout uses type and spacing without effects. Desktop Chromium emulation was checked; physical phones, Safari and screen readers were not tested.

## 2026-10-23 · Kraj treperenja i lebdećih linija (commit cae949a)
- Pokazna linija je deo natpisa: prati ga svakog kadra, prigušuje se i nestaje zajedno s njim (ranije: crtana samo pri rasporedu, pa lebdela sama tokom pokreta).
- Dubinsko treperenje: kamera near 0.1→2 / far 5000→4200 (preciznost <1 cm na 500 m), raster dignut i sveden na granice tla, podloga polygonOffset, građevine +0.18 m.
- Damping ispod praga ne drži scenu 'u pokretu' — natpisi se smire odmah.
- naziv_en za svih 14 elemenata: EN strana ima engleske natpise, izbor i dosije.
- Provera: tools/cdp-linije.cjs (mir/prevlačenje/damping/bez oznaka — 0 siročića) prošla lokalno i uživo; cdp-provera 1440/390, blizanac, EN — 0 grešaka, 0 sudara.

## 2026-10-23 — Dve građe makete i kompaktna legenda
- Konvencija arheoloških maketa u 3D: belo = rekonstruisana zapremina, kamen = stvarno sačuvano zidanje. U Rekonstrukciji sačuvana visina viri kao kameni sokl (2%); u Sačuvanom stanju nad kamenim ostacima stoji isprekidani „duh" rekonstruisane zapremine (bez ispune, klik prolazi kroz njega).
- Razlika režima je sada vidljiva na prvi pogled; duh ulazi u kadriranje da ne bude odsečen.
- Legenda prerađena: dve kolone (Poreklo mere / Zapremina), 22% visine ekrana na desktopu i 21% na telefonu (ranije praktično ceo ekran); tekstovi skraćeni, dodat raster tla 20 m.
- Rek/Sačuvano kao segmentni prekidač u HUD-u.
- Provere: proveri-registre (115 zapisa, shapeCheck 13), proveri-suite (8 strana), cdp-provera index/blizanac/EN na 1440 i 390 (0 grešaka, 0 sudara, 0 van okvira), cdp-linije (0 siročića), snimci oba režima + legenda pregledani okom.
