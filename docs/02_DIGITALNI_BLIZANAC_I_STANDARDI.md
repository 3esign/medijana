# Medijana · Arhitektura digitalnog blizanca i standardi interpretacije

**Dokument:** 02_DIGITALNI_BLIZANAC_I_STANDARDI.md  
**Projekat:** Medijana (Naissus) — Digitalni arheološki blizanac i forenzička platforma  
**Nadležni departman:** Departman za arheologiju · Digitalni blizanci · BIM · CAD · GIS

---

## 1. Problem konvencionalnih 3D rekonstrukcija

U avgustu 2026. godine, povodom obeležavanja 90 godina istraživanja Medijane, javnosti je premijerno prikazan dvominutni film sa 3D rekonstrukcijom Vile sa peristilom. Iako je taj video poslužio popularizaciji lokaliteta, sa stanovišta naučne metodologije on pati od standardnih slabosti „estetskih rendera“:
1. **Zatvoreni crni sanduk (*Black Box*):** Korisnik vidi gotove zidove, stubove i krovove, ali ne zna šta od toga zaista postoji na terenu, a šta je plod mašte 3D dizajnera.
2. **Odsustvo falsifikabilnosti:** Nema veze između 3D geometrije i arheološkog terenskog dnevnika, publikacija ili stratigrafskih jedinica.
3. **Statičnost jedne faze:** Prikazan je samo jedan idealizovani trenutak, dok je Medijana živela, menjala se i rušena kroz više od dva veka.
4. **Naučno nepoverenje:** Zbog ovakvih pristupa, arheološki instituti i konzervatori beže od digitalnih tehnologija i doživljavaju ih kao „igračke za turiste“.

**Cilj Svemira:** Izgraditi **istraživački arheološki digitalni blizanac** koji se ne bori za filmske efekte, već za naučnu istinu i potpunu proverljivost svakog kubnog decimetra rekonstruisanog prostora.

---

## 2. Standardi verodostojnosti: London Charter i Seviljski principi

Digitalni blizanac Medijane striktno implementira dva vodeća međunarodna standarda:

### 1. Londonska povelja (The London Charter, 2009)
Zahteva uvođenje **Paradata** sloja — metapodataka o procesu interpretacije. Svaki geometrijski element u modelu mora nositi zapis:
- Koji arheološki dokaz *in situ* podupire ovu geometriju?
- Koja literatura ili analogija je korišćena ako element nije sačuvan?
- Ko je doneo odluku o modelovanju i sa kojim stepenom pouzdanosti?

### 2. Principi iz Sevilje (Seville Principles on Virtual Archaeology, 2011)
Definišu skalu verodostojnosti (*Scale of Historical-Archaeological Validity*). U digitalnom blizancu Medijane primenjuje se standardizovana trostepena skala pouzdanosti:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   SKALA POUZDANOSTI (SEVILLE PRINCIPLES)               │
├────────────────────┬───────────────────┬───────────────────────────────┤
│ NIVO A: ČINJENICA  │ NIVO B: ANALOGIJA │ NIVO C: HIPOTEZA              │
│ (In situ dokaz)    │ (Poređenje)       │ (Konstruktivna verovatnoća)   │
│ Pouzdanost: 90–100%│ Pouzdanost: 60–80%│ Pouzdanost: 30–50%            │
└────────────────────┴───────────────────┴───────────────────────────────┘
```

#### Detaljna definicija nivoa na Medijani:
- **NIVO A (Činjenica / In situ — zeleni sloj):**
  - Strukture koje fizički postoje na terenu i izmerene su terestričkim laserskim skeniranjem (TLS) ili milimetarskom fotogrametrijom.
  - *Primeri na Medijani:* Temelji i zidovi vile do sačuvane visine (0,5–1,8 m), mozaici peristila i stibadijuma, baze stubova in situ, olovne vodovodne cevi, ukopane dolije u horreumu.
  - *Merna nesigurnost:* $\le \pm 5\text{ mm}$.
- **NIVO B (Osnovana analogija — žuti sloj):**
  - Elementi koji nisu sačuvani u celosti na Medijani, ali su njihovi fragmenti pronađeni u šutu ili postoje identične paralele iz istog perioda i regiona.
  - *Primeri na Medijani:* Visina stubova peristila (rekonstruisana na osnovu prečnika pronađenih baza i očuvanih kapitela), korintski kapiteli, krovni nagib izračunat na osnovu raspona zidova i analogije sa carskom palatom Felix Romuliana (Gamzigrad) i Dioklecijanovom palatom u Splitu.
  - *Merna nesigurnost:* $\pm 100–300\text{ mm}$ (proporcijski fiksirano po Vitruviju i kasnoantičkim modulima).
- **NIVO C (Hipotetička rekonstrukcija — crveni / providni sloj):**
  - Elementi za koje nema direktnih materijalnih tragova na lokalitetu, već su izvedeni na osnovu opštih inženjersko-statičkih zakonitosti ili literarnih opisa.
  - *Primeri na Medijani:* Spratna visina i raspored prozora na gornjoj zoni zidova stibadijuma, osvetljenje kroz krovne laterne, unutrašnja dekoracija nestalih gornjih zona fresaka.
  - *Prikaz u blizancu:* Prikazuju se poluprovidno ili sa mogućnošću isključivanja jednim klikom („Reality toggle“).

---

## 3. Tehnološki stek digitalnog blizanca

Za razliku od komercijalnih gaming endžina koji podatke zaključavaju u vlasničke formate, blizanac Medijane se gradi na otvorenoj, arhivski trajnoj arhitekturi:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   TEHNOLOŠKI STEK BLIZANCA MEDIJANE                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. PREZENTACIJA: WebGPU / Three.js (Svemir citytwin endžin)            │
│    - Pregled u bilo kom browseru na desktopu i telefonu bez instalacije│
│    - Interaktivni slajder faza i prekidač paradata slojeva             │
├────────────────────────────────────────────────────────────────────────┤
│ 2. MODELOVANJE I GEOMETRIJA: OpenUSD + HBIM                            │
│    - OpenUSD (Universal Scene Description) slojevi po fazama           │
│    - Parametarski HBIM elementi sa klasifikacijom materijala           │
├────────────────────────────────────────────────────────────────────────┤
│ 3. SEMANTIKA I PODACI: CIDOC CRM (ISO 21127) + CRMarchaeo             │
│    - JSON-LD ontološki graf povezan sa bazom nalaza Narodnog muzeja    │
│    - Georeferencirani koordinatni sistem EPSG:6340 (MGI 1901 / Balkans)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Četvorofazna vremenska slojevitost

Korisnik digitalnog blizanca ima na raspolaganju vremensku osu (*timeline scrubber*) koja u realnom vremenu menja geometriju i stratigrafiju lokaliteta:

1. **Stanje 1: Poljoprivredna vila (cca 300. god)**
   - Prikaz skromnih objekata, ekonomskih dvorišta i rane agrarne strukture.
2. **Stanje 2: Konstantinov carski sjaj (cca 330. god)**
   - Puna raskoš rezidencije: otvoreni peristil sa fontanama, stibadijum sa mozaikom Meduze, terme u funkciji (para koja izbija iz otvora), horreum pun zaliha.
3. **Stanje 3: Kasnoantičke pregradnje i hrišćanski horizont (cca 390. god)**
   - Delimično pregrađeni tremovi, podizanje severne i južne bazilike sa baptisterijumom, vidljive spolije, kasni grobovi.
4. **Stanje 4: Post-hunska destrukcija i ruševina (cca 450. god)**
   - Obrušeni krovovi, slojevi gari, napušteni hipokausti, formiranje gotske nekropole.
5. **Stanje 5: Savremeno arheološko nalazište (2026. god)**
   - Današnje stanje sa zaštitnom nadstrešnicom, sačuvanim zidovima, konzerviranim mozaicima i zonom tekućih iskopavanja.

---

## 5. Paradata interfejs za istraživače

Kada istraživač ili student u web pregledaču klikne na bilo koji element u 3D sceni (npr. stub peristila br. 7):
1. Otvara se **Forenzički info-panel**:
   - **ID elementa:** `MED-PER-COL-07`
   - **Stratigrafska pripadnost:** USM 104
   - **Nivo pouzdanosti:** Nivo B (80%)
   - **Izvorni dokaz:** Baza stuba in situ (TLS sken 2024, greška 3 mm). Trup i kapitel modelirani prema kapitelu inventarski broj `NM-NIS-A-1422` pronađenom u šutu 1968. godine.
   - **Referenca:** G. Milošević (2016), str. 114–118.
   - **Foto / sken dokaza:** Klikom se otvara izvorni ortofoto i 3D oblak tačaka samog kapitela u depou.

Ovim pristupom digitalni blizanac prestaje da bude ilustracija i postaje **istraživački instrument prve klase**.
