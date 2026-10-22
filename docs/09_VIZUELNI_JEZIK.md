# 09 · Vizuelni jezik suite-a

**Status:** odluka na snazi od 23.10.2026 (faza P1).
**Važi za:** sve stranice suite-a, 3D maketu, mapu i štampane izvoze.
**Izvor stila:** [`assets/medijana.css`](../assets/medijana.css) · ponašanje: [`assets/suite.js`](../assets/suite.js) · skelet stranica: [`tools/uskladi-skelet.cjs`](../tools/uskladi-skelet.cjs)

---

## 1. Teza

> **Boja nije ukras i nije „antika“. Boja je tvrdnja o dokazu.**

Prvi izgled sajta koristio je zlato na braon podlozi kao znak starine. To je
kostim: ništa ne govori o lokalitetu, a sugeriše autoritet koji nemamo.
Zamenjen je sistemom koji dolazi iz same discipline.

Arheološki crtež vekovima razlikuje **sačuvano** od **rekonstruisanog**:
zid koji stoji crta se puno, pretpostavljeni zid — šrafurom ili isprekidanom
linijom. Ta konvencija je ovde uzeta kao **ceo vizuelni sistem**, ne kao
dekorativni motiv. Veza sa antikom nije u paleti, nego u metodu kojim antika
do nas uopšte dolazi: merenjem i notacijom.

Posledica: paleta nema nijednu „brend“ boju. Četiri hrome vrednosti u sistemu
su četiri klase dokaza i ništa drugo. Sve ostalo je neutralna skala podloge i
mastila.

---

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
`--d3`, `--g0`), pa paleta fizički ne može da se razdvoji na dve verzije.

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
(`.raster`) — podsećanje da je ceo sadržaj merenje, ne ilustracija.

**Pisma** (self-hosted, OFL, bez poziva ka trećoj strani — vidi
[`assets/fonts/LICENSE.md`](../assets/fonts/LICENSE.md)):

- **Source Serif 4** — naslovi i narativni tekst. Akademski, ne dekorativan.
- **Inter** — podaci, oznake, kontrole, sve brojke (`tabular-nums`).
- **sistemski mono** — identifikatori (`G-HORREUM`, `M-H09`, `MED-04`) i mere.

Pravilo: **serif govori, sans meri.** Identifikator nikada nije u serifu.

**Radijus 3 px, ne 10.** Crtački, skoro oštar — bliže listu papira nego
aplikaciji.

---

## 4. Zaglavlje

Jedno zaglavlje na svih devet stranica, generisano iz
[`tools/uskladi-skelet.cjs`](../tools/uskladi-skelet.cjs), pa ne može da se
razlikuje od stranice do stranice (ranije su postojala tri različita, a 3D
prikaz nije imao `<nav>` uopšte).

- **Marka:** kvadrat sonde sa mrežom — jedan kvadrant pun (poznato), jedan
  šrafiran (pretpostavljeno), dva prazna. Znak projekta je sopstvena teza.
- **Navigacija:** sedam stranica + jezički par, isti redosled svuda, tačno
  jedan `aria-current`.
- **Ispod 1040 px:** navigacija se sklapa u fioku sa dugmetom (`aria-expanded`,
  zatvaranje na `Esc` i na izbor stavke). Na 3D prikazu zaglavlje je fiksno,
  a oznake objekata se ne crtaju ispod njega.
- **Alat:** prebacivanje teme i veza ka repozitorijumu.

---

## 5. Pristupačnost i otpornost

- Kontrast teksta i podloge ≥ 4.5:1 u obe teme; `:focus-visible` je vidljiv
  prsten, ne uklonjen outline.
- Klasa dokaza se nikad ne prenosi **samo** bojom (vidi tačku 2).
- `prefers-reduced-motion` gasi prelaze i automatsku rotaciju 3D podloge.
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
