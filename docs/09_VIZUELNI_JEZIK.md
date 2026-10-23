# 09 · Vizuelni jezik suite-a

**Status:** odluka na snazi od 23.10.2026 (faza P1).
**Važi za:** sve stranice suite-a, 3D maketu, mapu i štampane izvoze.
**Izvor stila:** [`assets/medijana.css`](../assets/medijana.css) · ponašanje: [`assets/suite.js`](../assets/suite.js) · skelet stranica: [`tools/uskladi-skelet.cjs`](../tools/uskladi-skelet.cjs)

---

## 1. Namena

Prikaz pomaže čitanju modela i njegovih podataka. Boje i oznake razlikuju
poreklo mera; ne potvrđuju tačnost geometrije. Tekst sajta kratko objašnjava
sadržaj i sledeći korak, bez slogana i obrazlaganja sopstvene estetike.

Pilot je početna faza projekta u okviru saradnje sa Arheološkim institutom.
Potpis: doc. dr Bojan Končarević i doc. dr Poturak Semir, Univerzitet
Union – Nikola Tesla, Fakultet za graditeljski menadžment (Semirova instrukcija,
23.10.2026). Obim naredne faze i pristup dokumentaciji ostaju za zajednički dogovor.

## 2. Konvencija crteža — četiri znaka

| znak | klasa | u registru (`pouzdanost`) | šta tačno znači |
|---|---|---|---|
| **puna površina** | objavljena mera | `objavljena_dimenzija` | dimenzija stoji u objavljenoj literaturi; mi je prenosimo |
| **tonirana površina** | izvedeno | `izvedeno_iz_povrsine` | mera je izračunata iz objavljenog podatka, pa nosi našu računicu |
| **šrafura + isprekidana ivica** | šematsko | `sematski` | oblik i položaj su radna pretpostavka do geodetskog plana (P2) |
| **tačkasta ivica, bez ispune** | sporno | `prikaz:false` | identitet ili pripadnost su osporeni; zapis ostaje, prikaz izlazi |

Znak je uvek **dvostruk**: boja + obrazac (ispuna, šrafura, vrsta ivice). Tako
razlika ostaje čitljiva i bez raspoznavanja boja, i u crno-beloj štampi.

Isti četiri znaka važe na sve tri površine:

- **stranice** — `.znak`, `.traka-dokaza`, `.polje-granica`
- **mapa** — ispuna i isprekidanost poligona u `mapa.html`
- **3D maketa** — boja i prozirnost materijala u `blizanac.html`

Maketa čita boje iz istih CSS promenljivih kao stranice (`--d1`, `--d2`,
`--d3`, `--g0`), što olakšava usklađivanje palete.

**Granica:** znak govori o poreklu mere, ne o tačnosti. Objavljena dimenzija
može biti pogrešno objavljena; šematski oblik može biti blizu tačnog. Položaj,
visina i mera su tri odvojene tvrdnje — vidi `pokrivenost.html`.

---

## 3. Podloga, tipografija, mreža

**Dve teme, jedan sistem.** `teren` (tamna, podrazumevana — slaže se sa 3D
scenom) i `arhiv` (svetla, papir za crtanje). Biraju se dugmetom u zaglavlju,
pamte u `localStorage`, a prvi dolazak prati `prefers-color-scheme`. Nijedna
tema ne menja značenje znakova; menja se samo nosilac.

**Podloga je merna.** Umesto teksture pergamenta, hairline raster od 48 px
(`.raster`) — pomoćna mreža u pozadini prikaza.

**Pisma** (self-hosted, OFL, bez poziva ka trećoj strani — vidi
[`assets/fonts/LICENSE.md`](../assets/fonts/LICENSE.md)):

- **Source Serif 4** — naslovi i narativni tekst. Akademski, ne dekorativan.
- **Inter** — podaci, oznake, kontrole, sve brojke (`tabular-nums`).
- **sistemski mono** — identifikatori (`G-HORREUM`, `M-H09`, `MED-04`) i mere.

Identifikatori koriste monospace pismo.

**Radijus 3 px, ne 10.** Crtački, skoro oštar — bliže listu papira nego
aplikaciji.

---

## 4. Zaglavlje

Jedno zaglavlje na svih devet stranica, generisano iz
[`tools/uskladi-skelet.cjs`](../tools/uskladi-skelet.cjs), pa ne može da se
razlikuje od stranice do stranice (ranije su postojala tri različita, a 3D
prikaz nije imao `<nav>` uopšte).

- **Marka:** kvadrat sonde sa mrežom — jedan kvadrant pun (poznato), jedan
  šrafiran (pretpostavljeno), dva prazna. Znak se koristi za povratak na naslovnu.
- **Navigacija:** sedam stranica + jezički par, isti redosled svuda, tačno
  jedan `aria-current`.
- **Ispod 1040 px:** navigacija se sklapa u fioku sa dugmetom (`aria-expanded`,
  zatvaranje na `Esc` i na izbor stavke). Na 3D prikazu zaglavlje je fiksno,
  a oznake objekata se ne crtaju ispod njega.
- **Alat:** prebacivanje teme i veza ka repozitorijumu.

---

## 5. Pristupačnost i otpornost

- Sekundarni tekst (`--ink3`) prema četiri pune podloge ima izmeren kontrast
  najmanje 4,83:1 u svetloj i 4,94:1 u tamnoj temi. Ovo nije potpuna WCAG revizija;
  prozirni slojevi i spoljne pločice mape traže zasebnu proveru. `:focus-visible`
  je vidljiv prsten, ne uklonjen outline.
- Klasa dokaza se nikad ne prenosi **samo** bojom (vidi tačku 2).
- Naslovna nema automatsku rotaciju. `prefers-reduced-motion` i štednja podataka
  zadržavaju statični render do izričitog pokretanja pregleda.
- Naslovna bez JavaScript-a prikazuje statičan render i ceo tekst; brojke se
  tada ne ispisuju i to se kaže, umesto da se upišu rukom.
- Štampa (`@media print`) skida zaglavlje i kontrole; kartice se ne lome.
- Brojke na naslovnoj dolaze iz `data/*.jsonl` u trenutku učitavanja. Ako
  registar poraste, strana poraste sa njim.

---

## 6. Šta ovaj sistem **nije**

- Nije rekonstrukcija izgleda. Boja i oblik ne tvrde kako je išta izgledalo.
- Nije dokaz tačnosti. Vizuelni red ne zamenjuje recenziju ni terenski plan.
- Nije konačan. Kad u P2 stignu geodetski plan i HBIM, dodaje se peti znak —
  **mereno na terenu** — i tek tada šrafura počinje da se povlači.

## 7. Prostorni interfejs — završni prolaz, 23.10.2026

Naslovna razdvaja uvod i prostorni instrument: tekst levo, stabilan 3D prikaz
desno; na telefonu su jedan ispod drugog. Dugmad 3D / Osnova menjaju pogled iste
scene. Osnova je pogled odozgo na šematski model, ne digitalizovan terenski plan.
Veza na regionalnu mapu ostaje zasebna. Oba jezika koriste isti raspored i kod.

U punom pregledaču izbor objekta otvara njegov dosije i uokviruje ga uz slobodan
prostor za panel. Ceo kompleks vraća kadar; Osnova menja pravac kamere. Izbor
objekta je dostupan i iz standardnog polja tastaturom. Povlačenje kamere ne
otvara dosije na kraju gesta. Legenda se otvara po potrebi.

Kamera uklapa projektovane granice vidljivih objekata, a ne teren ili samo
obuhvatnu kuglu. Posle izbora objekta, promene veličine ili prikaza računa se
raspoloživ prostor. Scena se ponovo crta kada se nešto promeni, bez stalnog
okretanja i prazne petlje. Zamenjeni materijali i geometrije se oslobađaju.

Statična slika ostaje prisutna dok 3D scena ne potvrdi spremnost. Sam događaj
učitavanja iframe-a nije potvrda da su WebGL, moduli i registri dostupni.

**Provera:** 126 browser kontrola; svih osam stranica na 390, 768 i 1440 px;
kadriranje na 390×844, 768×1024, 1440×960, 1920×1080 i 844×390. Provereni su
izbor, reset, prikaz sačuvanih visina, meni i Escape, tema u ugrađenoj sceni,
smanjeno kretanje, nedostupan CDN i statičan sadržaj bez JavaScript-a. Pregledana
su tri vizuelna prolaza. Provera je izvedena u desktop Chromiumu sa emulacijom;
fizički telefon, Safari i čitač ekrana nisu ispitani. Arheološki registri i
njihove tvrdnje nisu ponovo proveravani ovim dizajnerskim zahvatom.

**Kapija lepote:** rečenica je „istraži prostor i proveri izvor“; brojke dolaze
iz registara; uklonjeni su tekst preko modela, stalno okretanje i prevelika
legenda; redosled je lokalitet → pregled → istraživanje; kretanje odgovara izboru;
naslovna ne zavisi od gradijenata, zamućenja ili senki; granice pristupačnosti
i kompatibilnosti navedene su iznad.
