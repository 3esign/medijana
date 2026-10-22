# Medijana · Ground truth, ukrštanje izvora, hipoteze i istraživačka pitanja

**Dokument:** 06_HIPOTEZE_I_PITANJA.md
**Projekat:** Medijana (Naissus) — Digitalni arheološki blizanac i forenzička platforma
**Veze:** [05_NIVOI_ANALIZE](05_NIVOI_ANALIZE.md) · [04_BIBLIOGRAFIJA](04_BIBLIOGRAFIJA_I_IZVORI.md) · Registar IZVORI.jsonl · MAPA_BIO_EKO Q01–Q12

Logika dokumenta je obrnuta od običnog pregleda: **prvo revidiramo šta stvarno znamo i gde se izvori sudaraju, pa iz toga izvodimo hipoteze i pitanja, pa tek onda tražimo literaturu.** Literatura se ne traži da bi potvrdila ono što želimo da čujemo, nego da razreši postavljeno pitanje.

---

## 1. Šta je kod nas ground truth

Ground truth nije „sve što je štampano". Hijerarhija snage dokaza za Medijanu:

| Nivo | Definicija | Naši izvori |
|---|---|---|
| **T1** | Kapitalna monografija sa stratigrafskom i arhitektonskom dokumentacijom | A-MEDIJANA-01 (Milošević 2016); delom A-MEDIJANA-03 (Jeremić 2006) |
| **T2** | Sinteze, korpusi, katalozi | A-MEDIJANA-02 (Petrović 1993), MED-03 (IMS IV, epigrafika), MED-08 (Drča 2004), MED-09 (Gavrilović Vitas 2014) |
| **T3** | Rani terenski izveštaji (metodologija pre rata) | A-MEDIJANA-04 (Vasić 1936) |
| **T4** | Preliminarni izveštaji i mediji tekućih kampanja | A-MEDIJANA-05 (2024–2026) |

**Pravila upotrebe:**
1. Tvrdnja ulazi u digitalnog blizanca samo ako je bar **T1/T2**. T4 **može samo da otvori pitanje**, nikad da ga zatvori.
2. Citiranje je dozvoljeno **samo u granicama `read_scope`** — šta je stvarno otvoreno, to se i tvrdi.
3. T3 (Vasić 1936) je pouzdan za **geometriju planova**, nepouzdan za **stratigrafiju** (KR-03).
4. Mapa ID-eva (registar ↔ bibliografija): A-MEDIJANA-01 = MED-07; -02 = MED-04; -03 = MED-05; -04 = MED-01; -05 = MED-10.

---

## 2. Protokol ukrštanja (cross-referencing)

1. **Dva nezavisna lanca:** ključna tvrdnja treba dva lanca dokaza koji ne dele isti rukovodilac/kampanju. Ako svi lanci vode do jedne ekipe (npr. sve na Medijani 1961–2015), tvrdnja je „jednolančana" i to se vidi u matrici (§3).
2. **Konflikt se ne rešava glasanjem ni autoritetom,** nego stratigrafijom, vezom i datiranjem. Dok se ne reši, obe verzije stoje u registru kontradikcija (§4).
3. **Hipoteza se gradi od konfliktа i praznina,** ne od utiska. Svaka hipoteza (§5) ima nivo analize, test, potvrdu i opovrgnuće.
4. **Superseded nije izgubljeno:** revidirana tvrdnja (npr. ranije hipoteze o perifernim objektima) ostaje u istoriji sa oznakom `nadjacano`, izvor ostaje citiran.
5. **Negativan i neizvestan rezultat se upisuju.** „Nismo mogli razlikovati" je naučni ishod, ne sramota.

---

## 3. Matrica ključnih tvrdnji × izvora

| # | Tvrdnja | Lanci | Status |
|---|---|---|---|
| 1 | Vila sa peristilom; četiri graditeljske faze | T1 (Milošević 2013, 2016) + T3 planovi (Vasić) | dobro utemeljena, ali **jedna istraživačka ekipa** — treba nezavisna revizija vezova (M-Q02) |
| 2 | Medijana = carska rezidencija, zadužbina Konstantina | T2 (Petrović 1993) + numizmatika (carski boravci) + epigrafika + arhitektonske analogije (Gamzigrad, Solun) | visok status; interpretacija nivoa B po paradata |
| 3 | Horreum 91×27 m | T2/T3 (Vasić, Petrović) + T1 (geometrija) | geometrija čvrsta; **funkcija sporna** → KR-01 |
| 4 | Stibadijum sa mozaikom Meduze, in situ | T3 (Vasić 1936) + T1 (konzervacija 2000-te) | čvrsta; status mozaika danas proveriti (M-Q12) |
| 5 | Oktogon = audijencijalna dvorana | T1 (Jeremić 2006) — **samo analogija** | nerešeno, Jeremić sam otvara pitanje → KR-05, M-H02 |
| 6 | Mermer skulptura „iz grčkih ili maloazijskih kamenoloma" | T2 (Gavrilović Vitas 2014) — jedan lanac, „ili" nerešeno | slabo → M-H04, M-Q05 |
| 7 | Razaranje od Huna 441–443 | istorijski okvir; **nema arheološke potvrde u registru** | radi se samo kao hipoteza → M-H07 |
| 8 | „Nekropola Gota" = sahranjivanje germanskih federata | **samo T4 mediji (2026)** | etiketa bez antropološke/genetske analize → KR-04, M-H08 |
| 9 | Vodovod sa izvora (Kamenički vis / Niška Banja) | T2 (Drča 2004) — jedan lanac | treba hidrološka verifikacija → M-Q09 |
| 10 | Kontinuitet lokaliteta kroz V vek (spolia, crkve) | T1 (Jeremić) + T4 (nova crkva 2026) | dobro utemeljeno orijentaciono; faze nedatirane → M-H10 |

Lekcija matrice: najpoznatije tvrdnje o Medijani (Konstantin, četiri faze) su čvrste; **najpopularnije priče u javnosti (Goti, hunski požar) su najslabije utemeljene u našem registru.** To je tačno obrnuto od utiska koji daje medij — i zato postoji ovaj dokument.

---

## 4. Registri kontradikcija (KR)

- **KR-01 · „Horreum" sa dolia.** Identifikacija objekta 91×27 m kao žitnice stoji uz nalaz masivnih ukopanih dolia (RECNIK *horreum*). Ukopani dolia (*dolia defossa*) su standard vinskih ulja/podruma, ne žitnica; žito se skladišti u vrećama/amforama na podignutim podovima. Ili je objekat mešovite funkcije (žito + tečnosti), ili je identifikacija interpretativna. **Rešenje:** M-H09.
- **KR-02 · Revizija Petrovićevih hipoteza.** Deo tumačenja perifernih objekata iz 1993 revidiran je iskopavanjima 2000–2015 (zabeleženo u `limits` A-MEDIJANA-02). Pravilo: pre citiranja Petrovića za pojedinačni objekat, proveriti stanje kod Milošević 2016.
- **KR-03 · Predratna „dubina" nije stratigrafija.** Vasić 1936 beleži nalaze dubinama i bez Harris matrice; ti podaci se ne mogu prevoditi u današnje US. Koristimo ga za planove i geometriju, nikad za redosled slojeva.
- **KR-04 · Etiketa „nekropola Gota".** Ime je interpretacija iz javnih saopštenja (prilozi tipa fibula i oružje), pre antropološke, izotopske ili genetske analize. Interni radni naziv: **„nekropola kraj severne crkve"**. Isti standard koji je već primenjen na nivou sesija (lekcija G-3448: uloga/naziv nije dokaz).
- **KR-05 · Funkcija oktogona.** Audijencijalna dvorana vs. svetilište/letnjikovac — Jeremić 2006 ostavlja otvoreno. Držimo obe opcije dok M-H02 ne razdvoji.

---

## 5. Hipoteze (M-H01–M-H10)

Status svih: **NEPROVERENO** — u paradata su Nivo C dok ne budu testirane. „Izvedena iz" ukazuje na matricu §3 i KR §4.

**M-H01 · Faze su zasebni poduhvati** (N1/N3/N6)
Četiri faze Vile sa peristilom su vremenski razdvojeni građevinski poduhvati, a ne kontinuirana izgradnja. *Test:* vezovi zidova + numizmatika slojeva veza + arheomagnetizam opeke po fazi. *Potvrda:* različiti TPQ u vezovima. *Opovrgnuće:* homogen materijal, kontinuitet bez vezova.

**M-H02 · Oktogon je reprezentativna, ne kultna zgrada** (N1/N3)
 *Test:* prostorna analiza pristupa i ose, raspored temperature hipokausta, inventar opreme, poređenje sa Galerijevom palatom i Romulianom. *Potvrda:* reprezentativna oprema + ceremonijalna osa. *Opovrgnuće:* nalazi kulta na primarnim mestima. Rešava KR-05.

**M-H03 · Olovo fistula ima prepoznatljiv rudarski potpis** (N5/N3)
Izotopi ²⁰⁶/²⁰⁷/²⁰⁸Pb razdvojiti će regionalne rudne basene i eventualno promenu snabdevanja između faza. *Test:* MC-ICP-MS na sečene uzorke fistula; poređenje sa bazama rudnika Balkana. *Potvrda:* klasteri po fazi. *Opovrgnuće:* heterogenost bez strukture. Kombinacija sa žigovima (A-MEDIJANA-02) = radionica + rudnik.

**M-H04 · Mermer je Prokonnes za arhitekturu, različiti izvori za skulpturu** (N3/N4)
Analogno konstantinovskom dobu, arhitekturna oprema ide iz velikih imperijalnih kamenoloma; skulptura može biti druga. *Test:* maksimalna petrografija + C/O izotopi na skulpturi (MED-09) i opus sectile. *Potvrda:* usklađeni potpisi po grupama. *Opovrgnuće:* potpisi lokalnih krečnjaka.

**M-H05 · Tesere su pretežno lokalne; ekskluzivne boje su uvoz** (N3)
Katalog tesera već postoji u T1 (A-MEDIJANA-01, petrografija). *Test:* re-čitanje kataloga + pXRF mapiranje u rekonstruisanom rasporedu. *Potvrda:* dve klase (lokalni krečnjaci / uvozni porfir i bojeni mermeri). Ovo pretvara postojeći ground truth u lanac snabdevanja.

**M-H06 · Kanal termi nosi intestinalne parazite** (N2/N4/N5)
*Test:* jedan uzorak iz zatvorenog kanala — ELISA antigen (Giardia, Entamoeba) + sedDNA; paralela: Jerusalim toaleti (A-BIO-03). *Potvrda:* ponovljen pozitivan na dve metode. *Opovrgnuće:* negativan rezultat upisati (depozit bez intestinalnog materijala) — i on je saznanje o higijeni i očuvanosti.

**M-H07 · Sloj razaranja 441–443 je arheološki vidljiv** (N2/N3/N6)
*Test:* mikromorfologija sagorevanja na blok-uzorku izloženog profila + numizmatika zatvorenih ostava (MED-08) + arheomagnetizam opeke. *Potvrda:* sagorevanje + TPQ ostave okviru 441–443. *Opovrgnuće:* sloj datiran drugačije — što je jednako vredan rezultat (KR: istorija nije dokaz dok se ne nađe u tlu).

**M-H08 · Nekropola kraj severne crkve je mešovita, mobilna populacija** (N4/N5, R02)
Umesto etikete „Gota" (KR-04): *test* ⁸⁷Sr/⁸⁶Sr + δ¹⁸O gleđi, aDNA samo kroz dozvole i etički okvir R02 mape. *Potvrda:* heterogen potpis (ne-lokalna deca → migracija). *Opovrgnuće:* homogen lokalni potpis. T4 saopštenja samo otvaraju pitanje.

**M-H09 · „Horreum" je bio mešovitog ili tečnog skladišta** (N2/N4/N5)
Rešava KR-01. *Test:* rezidue unutrašnjosti dolia (GC-MS — tartaratna kiselina / lipidi), mikromorfologija ispod dolia, epigrafika objekta. *Potvrda:* vinske/uljne rezidue. *Opovrgnuće:* tragovi žita (fitoliti, štetočine) — vratiti identifikaciju žitnice sa boljim dokazom nego 1936.

**M-H10 · Spolia crkava potiču sa lica mesta** (N1/N2/N6)
Materijal crkava uzet je iz carskih objekata Medijane, na nekoliko stotina metara — dokaz kontinuiteta i svrhovite prenamene. *Test:* usklađenost materijala spolia sa konkretnim objektima, tragovi transporta, vezovi sekundarne upotrebe, datiranje crkvenih faza. *Potvrda:* prepoznatljivi elementi vila/termi u crkvama. *Opovrgnuće:* druga provenijencija — pa pratimo gde.

---

## 6. Istraživačka pitanja (M-Q01–M-Q14)

Označeno je: nivo (§05), disciplina, literatura, i veza sa opštim pitanjima mape Q01–Q12.

| ID | Pitanje | Nivo | Disciplina | Veza |
|---|---|---|---|---|
| M-Q01 | Može li se od postojećih numizmatičkih i stratigrafskih podataka izgraditi Bayesov model faza? | N6 | statistika, numizmatika | Q12 |
| M-Q02 | Da li su vezovi četiri faze publikovani i reproducirivi? | N1 | Bauforschung | — |
| M-Q03 | Šta numizmatička struktura (gubici vs. ostave) kaže o monetizaciji i krizi 4.–5. v.? | N3/N6 | numizmatika, ekonomija | Q06 |
| M-Q04 | Koji rudni potpis nose fistule i menja li se između faza? | N5 | izotopi olova | Q07 |
| M-Q05 | Koliki deo mermera/tesera je uvoz, koliko lokalno? | N3/N4 | petrografija | Q07 |
| M-Q06 | Šta sediment termi i kanala nosi (paraziti, sedDNA, geohemija)? | N2/N4/N5 | parazitologija, mikrobiologija | Q02 |
| M-Q07 | Šta je od bioarheološkog materijala starih iskopavanja sačuvano, a šta izgubljeno bez flotacije? | N4 | arheobotanika | Q11 |
| M-Q08 | Kakav protokol uzorkovanja nekropole je primeren pre objave monografije? | N4/N5 | etika, izotopi | Q07 |
| M-Q09 | Može li se sistem snabdevanja vodom rekonstruisati GIS modelom i gde tražiti trase? | N0 | hidrologija, GIS | Q02 |
| M-Q10 | Koliko crkvene faze odstupaju od carskih — datum spolia prenamene? | N1/N6 | stratigrafija, ¹⁴C | — |
| M-Q11 | Da li geohemija prostorija (fosfati, metali) razdvaja funkcije (boravak / štala / radionica)? | N2 | geohemija | Q01 |
| M-Q12 | Kako sve nivoe vezati u jedan proverljiv lanac (CRMarchaeo + izotopi + numizmatika u istom grafu)? | R03 | informatika podataka | Q12 |
| M-Q13 | Koji balkanski/srpski izvori nedostaju u registru (Starinar, Glasnik, IMS, nemačka i francuska literatura)? | R02 | bibliografija | Q11 |
| M-Q14 | Kakva je mikro-klima i biofilm na mozaicima pod natkrivanjem (2022) i da li struktura šteti materijalu? | N1/M05 | mikrobiologija nasleđa | Q08 |

---

## 7. Plan pretrage literature (faza P1 → P2)

Redosled po prinosu uz cenu: jeftino pre skupo, registrovano pre spekulativno.

1. **M-Q13 (najjeftinije, najveća praznina):** ciljana pretraga na srpskom, nemačkom i francuskom — *Starinar*, *Glasnik Društva konzervatora*, IMS kongresi, stare nemačke i francuske studije o Naissusu. Ishod: A-MEDIJANA-06+ u IZVORI.jsonl.
2. **M-Q01/M-Q03:** numizmatički korpusi Moesije Superior + Bayesovsko modelovanje (A-MAT-01 već u registru). Ishod: model faza v1.
3. **M-Q04/M-Q05:** izotopi olova i trgovina mermerom (Proconnesos, Docimium) na kasnoantičkim Balkanima. Ishod: protokoli uzorkovanja pre terena.
4. **M-Q06:** studije toaleta/kanala i parazitologije (MAPA H02) — prilagoditi protokol uzorka za jedan kanal. Ishod: protokol X-Med-01.
5. **M-Q09:** hidrogeologija Niša i akvadukti. Ishod: GIS sloj N0 v1.
6. **M-Q14:** mikro-klima natkrivenih mozaika (M05 mape). Ishod: predlog monitoringa za instituciju-nosioca.

Pravilo pretrage: **jedno pitanje → jedna pretraga → jedan upis u IZVORI.jsonl** sa `supports`, `limits`, `read_scope`. Bez „skeniranja radi skeniranja".

---

## 8. Etika i ograničenja

- Ljudski ostaci: samo kroz dozvole nosilaca (NM Niš, AI Beograd, Zavod) i etički okvir R02 mape; nijedan podatak o nekropoli ne ide u javni blizanac bez odluke nosilaca.
- T4 (mediji) se citiraju sa datumom i linkom i nikad se ne pretvaraju u T1 tvrdnju pre monografije.
- Svaka promena statusa hipoteze (npr. M-H06 iz NEPROVERENO u TESTIRANO) upisuje se u `LOG.md` sa datumom, uzorkom i rezultatom — pozitivnim ili negativnim.
