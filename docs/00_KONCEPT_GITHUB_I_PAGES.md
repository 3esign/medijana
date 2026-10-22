# Medijana · Koncept GitHub repozitorijuma i Pages sajta

**Dokument:** 00_KONCEPT_GITHUB_I_PAGES.md · 22.10.2026
**Šta je ovo:** arhitektura i put rasta javnog digitalnog prisustva projekta — šta je repo danas, šta postaje u svakoj fazi, i zašto je GitHub pravi naučni instrument, a ne samo hosting.

---

## 1. Ideja u jednoj rečenici

> Repozitorijum **je** digitalni blizanac u svom najranijem obliku: još bez geometrije, ali već sa onim što geometriju čini naučnom — izvorima, nivoima pouzdanosti, hipotezama i izgovorenim granicama.

GitHub nije izlog projekta nego njegova **laboratorijska sveska sa javnim pečatom vremena**: svaki commit je datiran, potpisan i nepromenljiv dokaz šta se znalo i tvrdilo kog dana. Za razgovor sa Arheološkim institutom to je ključni argument — mi ne nudimo prezentaciju, nego **infrastrukturu proverljivosti** koju institucija može da kontroliše.

## 2. Dva lica, jedan izvor istine

| | **Repo (github.com/3esign/medijana)** | **Pages (sajt)** |
|---|---|---|
| Publika | istraživači, institucije, recenzenti | javnost, mediji, fondovi, studenti |
| Jezik | precizan, sa ID-jevima i statusima | isti sadržaj, čitljiv i lep |
| Sadržaj | docs/ (kanon), data/ (strojni registri) | renderovanje istih registara — **bez prepisivanja** |
| Pravilo | sve tvrdnje nose izvor i status | sajt ne sme da tvrdi ništa što registar ne tvrdi |

Nepovredivo: **Pages čita iz `data/*.jsonl` u vreme učitavanja.** Nijedna brojka se ne kuca dvaput; kad se registar promeni, sajt se promeni sam. Tako je nemoguće da javna priča „pobegne" od naučnog stanja — što je tačno bolest koju smo dijagnostikovali kod medijskih etiketa (KR-04 „nekropola Gota").

## 3. Slojevi repozitorijuma

```
medijana/
├── README.md             ← javno lice: cilj, stanje, granice, ponuda
├── CITATION.cff          ← kako se projekat citira (→ Zenodo DOI, §6)
├── index.html            ← Pages: naslovna
├── registri.html         ← Pages: živi registri (čita data/*.jsonl)
├── docs/                 ← kanon znanja, 00–06 (raste: 07 paradata, 08 HBIM…)
├── data/                 ← strojni registri — jedina istina za sajt i buduće alate
│   ├── RECNIK.jsonl         pojmovi sa izvorima
│   ├── NIVOI.jsonl          lestvica N0–N6
│   ├── HIPOTEZE.jsonl       M-H01–M-H10 (status, test, potvrda, opovrgnuće)
│   ├── KONTRADIKCIJE.jsonl  KR-01–KR-05
│   ├── PITANJA.jsonl        M-Q01–M-Q14
│   └── (P1→) IZVORI.jsonl   bibliografija sa supports/limits/read_scope
└── .github/              ← šabloni: nova hipoteza, novi izvor, kontradikcija
```

Logika rasta: **dokument rađa registar, registar rađa prikaz.** Doc 06 je rodio HIPOTEZE/KONTRADIKCIJE/PITANJA; doc 04 će roditi IZVORI.jsonl; doc 02 će u P2 roditi PARADATA.jsonl (element modela → dokaz → A/B/C).

## 4. GitHub kao naučni instrument — novije mogućnosti

1. **Issues = registar otvorenih pitanja.** Svaka hipoteza i kontradikcija može biti issue sa šablonom: tvrdnja, test, potvrda, opovrgnuće. Institutski saradnik komentariše bez ikakvog alata sem pretraživača; zatvaranje issue-a = promena statusa u registru, sa punom istorijom rasprave.
2. **Pull request = naučna recenzija.** Promena tvrdnje u registru ide kroz PR: vidi se ko predlaže, ko odobrava, šta je tačno promenjeno. Ovo je London Charter paradata princip sproveden kroz git mehaniku — besplatno.
3. **Zenodo DOI na svaki release.** GitHub–Zenodo integracija: svaka verzija repozitorijuma (npr. „P1 konsolidacija, v1.0") dobija trajni DOI i postaje **citabilna publikacija**. Za istraživače Instituta to je direktan akademski interes — citati.
4. **Actions kao čuvar registara.** CI provera na svaki push: JSONL parsira, ID-jevi jedinstveni, svaka hipoteza ima test+potvrdu+opovrgnuće, svaki link živ. Registar ne može da se pokvari neopaženo.
5. **Releases = vremenske kapsule znanja.** Stanje pred svaki sastanak sa institucijama zamrzne se kao release — pregovara se nad tačno određenom, nepromenljivom verzijom.
6. **Discussions** (kad uđu spoljni saradnici): mesto za ono što još nije ni hipoteza — slobodna rasprava odvojena od registara.

## 5. Pages — put rasta po fazama

- **P1 (sada):** naslovna + **živi registri** (`registri.html`): hipoteze, kontradikcije, pitanja, rečnik, nivoi — filtriranje po nivou/statusu, svaka kartica nosi ID i status. Već ovo niko u regionu nema javno.
- **P1→P2:** stranica **izvora** (IZVORI.jsonl → pretraživa anotirana bibliografija sa read_scope); **vremenska osa** lokaliteta (1936–2026: istraživači, kampanje, revizije); dvojezičnost (sr/en) za evropske fondove.
- **P2:** **pilot blizanac u pretraživaču** — stibadijum sa mozaikom Meduze, `<model-viewer>`/Three.js, gde klik na element otvara njegov paradata zapis (izvor + A/B/C). Prvi trenutak u kome sajt prestaje da bude dokument i postaje instrument.
- **P3:** integralni WebGPU prikaz, 5 vremenskih faza, paradata eksplorer preko celog kompleksa.
- **P4:** GIS sloj (trase vodovoda M-Q09, pejzaž N0) + edukativni moduli za školsku publiku.

Stalno pravilo dizajna: kasnoantička paleta (zlato/terakota/tamno), tipografija dokumenta, **nijedan element bez izvora** — i vizuelno: status NEPROVERENO se vidi, ne skriva.

## 6. Šta se odlučuje, redom

1. **Javno ili privatno** — Pages traži javan repo. Pre toga: pregled doc 03 (institucije, iznosi fondova) — ostaje li u javnoj verziji ili se povlači u privatni ogranak.
2. **Licenca** — predlog: dokumentacija CC BY-SA 4.0, kod MIT, uz izričitu ogradu da se o nalazima i terenskim podacima odlučuje sa institucijama; do dogovora „sva prava zadržana".
3. **Zenodo vezivanje** + prvi release `v0.1-p1` čim repo postane javan.
4. **Poziv prvom spoljnom čitaocu** iz Instituta — repo je spreman da primi komentar onog dana kad postane javan.

## 7. Granice ovog koncepta

- Koncept opisuje mehanizam, ne sadržaj: nijedna nova arheološka tvrdnja ovde nije uvedena.
- Zenodo, Actions i Discussions su opisani, ne uključeni — svaki se uključuje jednim potezom kad Semir odluči.
- P2/P3 vizuali zavise od podataka kojih još nema; obećava se mehanika prikaza, ne rekonstrukcija.
