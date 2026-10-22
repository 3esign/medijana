# Medijana · Nivoi analize: od pejzaža do molekula

**Dokument:** 05_NIVOI_ANALIZE.md
**Projekat:** Medijana (Naissus) — Digitalni arheološki blizanac i forenzička platforma
**Nadležni departman:** Departman za arheologiju · Arheologija kao forenzika · Biologija i ekologija mape
**Strojni registar:** [`NIVOI.jsonl`](../data/NIVOI.jsonl) · **Hipoteze i pitanja:** [`06_HIPOTEZE_I_PITANJA.md`](06_HIPOTEZE_I_PITANJA.md)

---

## 1. Zašto nivoi

Istovetan trag sa Medijane je istovremeno geometrija (zid), sediment (sloj), materijal (tesera, legura, kost), molekul (DNK, lipid, izotop) i vreme (faza, datum). **Nivo analize je rezolucija posmatranja, ne rang značaja.** Svaki nivo postavlja svoja pitanja, poziva svoje nauke i proizvodi svoje podatke — ali dokaz postaje dokaz tek kad je jasno **na kom nivou je izmeren** i **kako prelazi na nivo iznad ili ispod**.

Četiri stuba forenzike iz doktrinarne lekcije preslikavaju se na lestvicu ovako:

| Stub forenzike | Primarni nivoi |
|---|---|
| Arhitektura (Bauforschung) | N1 (kompleks/objekat), delom N2 (veze zid—sloj) |
| Zemljište (geoarheologija) | N0 (pejzaž), N2 (sloj/kontekst) |
| Novčići (numizmatički sat) | N3 (artefakt), N6 (hronologija) |
| Pokretni artefakti i ekofakti | N3 (artefakt), N4 (mikro-ostatak), N5 (molekul) |

**Pravilo prelaza nivoa:** dokaz važi na nivou na kome je izmeren. Prenos na drugi nivo zahteva izgovoren argument — lanac *uzorak → sloj → objekat → događaj*. Svaki prelaz je mesto greške (§4), i svaki prelaz se beleži u paradata (§5).

---

## 2. Lestvica N0–N6

Brojanje ide **od makro ka mikro** (N0 najšire → N5 najfinije); N6 je presečna vremenska osa. U narodnom smislu: N0–N1 su „makro-arheologija", N4–N5 „mikro-arheologija"; granica nije ideološka nego rezolucija merenja.

### N0 · Pejzaž i region (10²–10⁵ m)
- **Pitanja:** gde zašto baš ovde; voda, saobraćaj, sirovine, klima; odnos Medijana—Naissus.
- **Nauke:** geografija, geologija, hidrologija, klimatologija, pejzažna ekologija, epidemiologija pejzaža (One Health).
- **Metode:** GIS modeliranje, remote sensing / LiDAR, geofizika širokog reda, analiza izvora i kvaliteta vode, rekonstrukcija trasa puteva i akvadukata.
- **Na Medijani:** ravnica Nišave i Kameničkog visa; izvori za vodovod (RECNIK *fistula*, po Drči 2004); veza sa gradom i *Via Militaris/Diagonalis*; poljoprivredno zaleđe koje je prethodilo carskoj fazi.
- **Izvori:** A-MEDIJANA-02 (Petrović 1993, topografija), MED-02 u [04_BIBLIOGRAFIJA](04_BIBLIOGRAFIJA_I_IZVORI.md).

### N1 · Kompleks i objekat (10⁰–10² m)
- **Pitanja:** građevinski sklop, faze, funkcije prostorija, konstruktivne tehnike, spolia.
- **Nauke:** arhitektura, građevinsko inženjerstvo, mineralogija građevinskog kamena, istorija umetnosti.
- **Metode:** Bauforschung, vertikalna stratigrafija zida (USM/USMN), vezovi i prislonjenja, fotogrametrija/TLS, HBIM.
- **Na Medijani:** Vila sa peristilom (četiri faze), stibadijum sa mozaikom Meduze, zgrada sa oktogonom (hipokaust), terme, horreum (91×27 m), severna crkva sa spolijama.
- **Izvori:** A-MEDIJANA-01 (Milošević 2016, kapitalna), A-MEDIJANA-03 (Jeremić 2006, oktogon), A-MEDIJANA-04 (Vasić 1936, prvi planovi).

### N2 · Sloj i kontekst (10⁻¹–10⁰ m)
- **Pitanja:** redosled događaja, funkcija prostora kroz depozit, sloj razaranja, postdepozicioni procesi.
- **Nauke:** geoarheologija, pedologija, geohemija, sedimentologija, tafonomija.
- **Metode:** Harrisova matrica, blok-uzorci za mikromorfologiju tankih preseka, geohemija sedimenata (fosfati, teški metali, multielement ICP), granulometrija.
- **Na Medijani:** slojevi između graditeljskih faza; potencijalni sloj požara (hunski prodor 441–443, §H07); naslage u termama i kanalima; depozit ispod dolia.
- **Izvori:** MAPA_BIO_EKO E05, H04; metodske paralele A-BIO-01 (mikromorfologija).

### N3 · Artefakt (10⁻²–10⁻³ m)
- **Pitanja:** tipologija i datum, proizvodnja, trgovina, ekonomija, numizmatički sat.
- **Nauke:** numizmatika, arheometrija, mineralogija, metalurgija, staklarska hemija.
- **Metode:** tipologija i serijacija, *terminus post/ante quem*, pXRF i XRD, petrografija tankih preseka (keramika, tesere, mermer), metalografija i analiza legura, gravimetrija kovanica.
- **Na Medijani:** mozaici (geometrijski, Meduza) i njihove tesere; mermerna skulptura (Asklepije, Higija, Dionis); olovne fistule sa žigovima; keramika i dolia; fibule i oružje iz nekropole; novac i ostave.
- **Izvori:** A-MEDIJANA-01 (katalog mozaika sa petrografijom tesera), A-MEDIJANA-02 (numizmatika), A-MEDIJANA-04 (prvo otkriće), MED-08 (Drča 2004, ostave).

### N4 · Mikro-ostatak (10⁻³–10⁻⁶ m)
- **Pitanja:** šta su ljudi jeli, grijali, sadili, čuvali; kakva je bila higijena; ko je bio mobilan.
- **Nauke:** arheobotanika, palinologija, zooarheologija, entomologija, parazitologija, geochemija izotopa, analitička hemija.
- **Metode:** flotacija i sito analiza, fitoliti i diatomeje, mikromorfologija, parazitološka jaja (ELISA antigen), stabilni izotopi (δ¹³C, δ¹⁵N kost/koloagen; ⁸⁷Sr/⁸⁶Sr i δ¹⁸O zubna gleđ), GC-MS lipidne i reziduene analize.
- **Na Medijani:** sediment termi i zatvorenih kanala; sadržaj i stene dolia; kuhinjska keramika; zubi i kosti nekropole kraj severne crkve; ugljenisano seme iz slojeva faza.
- **Izvori:** MAPA_BIO_EKO E01, E02, H02, H03, H04, M04; metodske paralele A-BIO-01, A-BIO-03.

### N5 · Molekul (10⁻⁶–10⁻⁹ m)
- **Pitanja:** ko su bili ljudi, koji patogeni, odakle materijal na nivou atomskog potpisa.
- **Nauke:** molekularna biologija, genetika, mikrobiologija, proteomika, izotopska geohemija, nuklearna fizika (AMS).
- **Metode:** aDNA i sedimentarna DNK (sedDNA), paleomikrobiom (kamenac, koproliti), paleopatogenomika, zooMS proteomika, izotopi olova (²⁰⁶Pb/²⁰⁷Pb/²⁰⁸Pb za provenijenciju metala), AMS ¹⁴C.
- **Na Medijani:** izotopski potpis olova fistula → rudarski basen; sedDNA kanala termi → intestinalni protozooni; aDNA nekropole (uz stroge etičke uslove, §R02 mape); AMS na selektovane kratkotrajne uzorke za faze.
- **Izvori:** MAPA_BIO_EKO M01–M05, R01, R02; A-BIO-03 (paralela Jerusalim), A-MAT-01 (radiokarbon, modelovanje).

### N6 · Hronologija (presečna osa)
- **Pitanja:** kada — i koliko sigurno; redosled vs. apsolutni datum; sinhronizacija objekata.
- **Nauke:** numizmatika, statistika (Bayesovo modelovanje), fizika datiranja, dendrohronologija.
- **Metode:** relativna hronologija (stratigrafija, tipologija, vezovi, spolia) → apsolutna (¹⁴C, arheomagnetizam opeke, luminescencija) → Bayesian model (A-MAT-01). Numizmatika daje TPQ/TAQ; stratigrafija daje redosled — **ne mešati uloge**.
- **Na Medijani:** četiri faze vile; carski boravci IV veka (Konstantin, Konstancije II, Konstans, Julijan); ostave novca; hunski prodor 441–443 kao kandidat-epizoda za sloj razaranja; crkvene faze sa spolijama.
- **Izvori:** A-MAT-01 (Historic England, radiokarbon), A-MAT-04 (luminescencija opeke), A-MEDIJANA-02 (numizmatika).

---

## 3. Mapa nauka na nivoe

| Nauka | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|---|---|---|---|---|---|---|---|
| Geologija / geografija | ● | ○ | ● | ○ | ○ | | |
| Geohemija / izotopi | | | ● | ● | ● | ● | |
| Biologija (botanika, zoologija, ekologija) | ○ | | ○ | | ● | ○ | |
| Molekularna biologija / mikrobiologija | | | | | ○ | ● | |
| Hemija (analitička, organska) | | | ○ | ● | ● | ● | |
| Fizika (geofizika, datiranje, AMS) | ● | | | ● | | ● | ● |
| Građevinarstvo / arhitektura | | ● | ○ | | | | |
| Numizmatika / ekonomija | | | | ● | | | ● |
| Matematika / statistika / informatika | | | | | | | ● (Bayes, model, HBIM podaci) |

● primarni doprinos · ○ podrška. Nit B instituta (bio-arhitektura) koristi iste kolone N4–N5, ali sa suprotnim smerom prenosa: od živog sistema ka ideji prostora (Dve niti).

---

## 4. Prelazi nivoa = mesta greške

| Prelaz | Tipična greška | Kontrola |
|---|---|---|
| N0 → N1 | pogrešna georeferenca, naslagani GIS slojevi bez zajedničkog sistema | EPSG:6340/UTM 34N, referentna kota (rails §3) |
| N1 → N2 | zid datiran prema sloju koji je sekundaran (rovanje, nasip) | vezovi primarni, sloj samo kad je zatvoren |
| N2 → N3 | artefakt iz šute/rova datiran kao kontekst | samo zatvoreni horizonti nose TPQ |
| N3 → N4 | uzorak van konteksta (stari koncentrati iskopavanja bez US) | uzorkovanje tek od dokumentovanih jedinica |
| N4 → N5 | kontaminacija DNK, preneti mikrosloj (Q09 mape) | mikromorfologija *pre* molekule; kontrole |
| sve → N6 | datum uzorka ≠ datum događaja (stari predmet u mladom sloju; staro drvo; rezervoarski efekat) | kratkotrajni uzorci; Bayesian model; A-MAT-01 |

---

## 5. Nivoi u digitalnom blizancu

Svaki nivo dobija svoj sloj podataka, sa paradata nivoom A/B/C iz [02_DIGITALNI_BLIZANAC_I_STANDARDI](02_DIGITALNI_BLIZANAC_I_STANDARDI.md):

| Nivo | Sloj u modelu | Standard | Paradata |
|---|---|---|---|
| N0 | GIS pejzažni sloj (trasa, izvori, geologija) | CityGML / GIS kičma (P4) | A: snimljeno; B: modelirano |
| N1 | HBIM elementi + USM matrica zidova | CRMarchaeo / CIDOC CRM | A: sken; B: analogija; C: rekonstrukcija |
| N2 | US jedinice + geohemijske mape | CRMarchaeo (S8 Stratigraphy) | A/B |
| N3 | instancirani artefakti sa metrikom | CIDOC CRM E22 + link na registar izvora | A: predmet; B: tipologija |
| N4/N5 | tačke uzorkovanja sa protokolom i rezultatom | CRMsci (S19 Encounter, S22 sampling) | A: mera; B: analogija; C: interpretacija |
| N6 | vremenski model faza (5 stanja iz docs/02) | TM (CIDOC Time), Bayesian rasponi | B/C sve dok nema apsolutnih data |

---

## 6. Veza sa MAPA_BIO_EKO

Domeni mape (E01–R03) nisu preslikani 1:1 na nivoe, ali svaki ima primarni nivo primene na Medijani:

| MAPA domen | Primarni nivo | Medijana materijal |
|---|---|---|
| E01 arheobotanika, E02 zooarheologija | N4 | flotacija slojeva faza; fauna nekropole i kompleksa |
| E04 paleoekologija, E05 vode i sedimenti | N0/N2 | Nišava, izvori, kanali, naslage termi |
| H01 bioarheologija, H03 izotopi ishrane/mobilnost | N4/N5 | nekropola kraj severne crkve |
| H02 parazitologija i sanitarije | N4/N5 | sediment kanala i termi |
| H04 tafonomija i mikromorfologija | N2 | blok-uzorci slojeva i podova |
| M01 arheogenetika, M03 patogenomika | N5 | nekropola (etički okvir!), sediment |
| M04 proteomika i lipidi | N4/N5 | rezidue keramike i dolia |
| M05 mikrobiologija nasleđa | N1 (materijal u eksploataciji) | mozaici pod natkrivanjem (2022), mikro-klima |
| R01–R03 metodologija, etika, podaci | N6 + infrastruktura | sve navedeno |

Istraživačka pitanja mape Q01–Q12 ostaju opšta; projektna pitanja Medijane su M-Q01–M-Q14 u [06_HIPOTEZE_I_PITANJA](06_HIPOTEZE_I_PITANJA.md) i vezuju se za njih.

---

## 7. Pravila rada po nivoima

1. **Svaki podatak nosi oznaku nivoa** (npr. `N4-izotop`, `N1-vez`, `N6-TPQ`) — u bazi, u izveštaju i u paradata panelu.
2. **Nema prenosa bez argumenta:** tvrdnja sa N5 (izotop) ne pripisuje se N1 (objekat) dok ne postoji lanac uzorak→sloj→objekat.
3. **Negativan rezultat je rezultat:** uzorak bez nalaza upisuje se sa statusom `tested-negativan`, ne briše.
4. **Uzorak se planira pre nego što se traži:** protokol (kontejner, kontrola, zapremina, dokumentacija) definiše se unapred po šablonima mape (X01–X06).
5. **Ljudski ostaci idu samo kroz etički okvir** R02 mape i dozvole institucija nosilaca — nema istraživanja „usput".
