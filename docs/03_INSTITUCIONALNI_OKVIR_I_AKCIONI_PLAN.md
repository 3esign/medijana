# Medijana · Institucionalni okvir, partnerstva i akcioni plan

**Dokument:** 03_INSTITUCIONALNI_OKVIR_I_AKCIONI_PLAN.md  
**Projekat:** Medijana (Naissus) — Digitalni arheološki blizanac i forenzička platforma  
**Nadležni departman:** Departman za arheologiju · Univerzitet Svemira

---

## 1. Institucionalno mapiranje i ekosistem

Za uspeh projekta ključno je precizno razumevanje nadležnosti i uloga postojećih institucija u Republici Srbiji:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   INSTITUCIONALNA STRUKTURA MEDIJANE                   │
├────────────────────┬───────────────────┬───────────────────────────────┤
│ UPRAVLJAČ NA TERENU│ NAUČNO VOĐSTVO    │ ZAŠTITA I KONZERVACIJA        │
│ Narodni muzej Niš  │ Arheološki        │ Zavod za zaštitu              │
│ (Vlasnik zbirke,   │ institut Beograd  │ spomenika kulture Niš         │
│ lokaliteta i depo) │ (Istraživanja)    │ (Saglasnosti, konzervacija)   │
└─────────┬──────────┴─────────┬─────────┴───────────────┬───────────────┘
          │                    │                         │
          └────────────────────┼─────────────────────────┘
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TEHNOLOŠKI PARTNER: SVEMIR / UNIVERZITET SVEMIRA                      │
│ - HBIM i 3D WebGPU digitalni blizanac sa paradata slojevima            │
│ - CRMarchaeo ontologija i semantička integracija podataka              │
│ - Interaktivne obrazovne platforme i otvoreni FAIR repozitorijumi      │
└────────────────────────────────────────────────────────────────────────┘
```

### Institucionalne uloge:
1. **Narodni muzej Niš:**
   - Nadležan za neposredno upravljanje arheološkim parkom Medijana, čuvanje pokretnih nalaza, depoe i prijem posetilaca.
   - Poseduje arhivsku terensku dokumentaciju (dnevnike iskopavanja, planove, fotografije od 1936. do danas).
2. **Arheološki institut u Beogradu:**
   - Vodeća naučnoistraživačka institucija u zemlji. Rukovodi sistematskim arheološkim iskopavanjima na Medijani u saradnji sa muzejom.
   - Nosioci su naučnih interpretacija, publikovanja monografija i predlaganja novih sondi.
3. **Zavod za zaštitu spomenika kulture Niš:**
   - Nadležan za izdavanje konzervatorskih uslova, nadzor nad radovima na zaštitnoj konstrukciji i konzervaciju mozaika i zidova.
4. **Ministarstvo kulture Republike Srbije:**
   - Finansira tekuća arheološka istraživanja i infrastrukturne radove (npr. kapitalni projekat natkrivanja lokaliteta i konzervacija crkava vredna 9,7 miliona dinara u 2026).

---

## 2. Pilot saradnje

Pilot projekta u okviru saradnje sa Arheološkim institutom predstavlja
početni pregled objavljenih izvora, radne 3D makete i istraživačkih pitanja.

**doc. dr Bojan Končarević · doc. dr Poturak Semir**

Univerzitet Union – Nikola Tesla · Fakultet za graditeljski menadžment

Sledeća faza podrazumeva dogovor o objektu, dostupnim planovima, pravima
korišćenja i stručnoj proveri. Parametarski HBIM i povezivanje geometrije sa
bazom dokumentacije planirani su pravci razvoja. Sadašnji prikaz je šematski.

Ovaj opis prati Semirovu instrukciju od 23.10.2026; ne predstavlja tekst ugovora
niti potvrdu da je ustanova recenzirala postojeći model.

---

## 3. Finansijski kanali i projektni pozivi

| Nivo | Finansijski instrument | Obim / Iznos | Uloga Svemira |
|---|---|---|---|
| **Nacionalni** | **Ministarstvo kulture RS:** Konkurs za digitalizaciju kulturne baštine | 1.000.000 – 3.000.000 RSD godišnje | Izrada digitalnog blizanca i paradata platforme |
| **Nacionalni** | **Fond za nauku RS:** Programi PRISMA / IDEJE | Do 300.000 EUR (3 godine) | Tehnološki partner u konzorcijumu sa Arheološkim institutom |
| **Evropski** | **Creative Europe (Kultura):** European Cooperation Projects | 200.000 – 1.000.000 EUR | Povezivanje Medijane sa carskim rezidencijama u regionu (Gamzigrad, Solun, Trier) |
| **Evropski** | **Horizon Europe (Cluster 2):** HORIZON-CL2-HERITAGE | 2.000.000 – 4.000.000 EUR | Razvoj naprednih AI i digital twin metoda za baštinu |

---

## 4. Akcioni plan realizacije (Faze projekta)

Projekat Medijana u Svemiru strukturisan je kroz 4 jasne, merljive faze:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                       ČETIRI FAZE PROJEKTA MEDIJANA                     │
├────────────────────┬───────────────────┬───────────────────┬───────────┤
│ FAZA P1 (M1–M2):   │ FAZA P2 (M3–M4):  │ FAZA P3 (M5–M8):  │ FAZA P4:  │
│ Arhivska i         │ Pilot HBIM i      │ Integralni WebGPU │ GIS baza i│
│ forenzička baza    │ Stibadijum Paradata│ Blizanac (5 faza) │ edukacija │
└────────────────────┴───────────────────┴───────────────────┴───────────┘
```

### Faza P1: Naučno-forenzička konsolidacija i konceptualni model (Tekuća faza)
- **Status:** Započeta u ovom dahu (`project_kit.js phase start`).
- **Aktivnosti:**
  1. Digitalizacija i strukturisanje 90 godina objavljene literature o Medijani (Vasić 1936 $\rightarrow$ Milošević 2016 $\rightarrow$ izveštaji 2026).
  2. Formiranje ontološkog rečnika lokaliteta (`RECNIK.jsonl`) i registra znanja (`KNOWLEDGE.md`).
  3. Izrada konceptualnog modela 4 stuba dokaza (arhitektura, tlo, numizmatika, artefakti).
  4. Priprema nacrta sporazuma o naučno-tehničkoj saradnji.
- **Isporuka:** Kompletirana projektna dokumentacija, bibliografski dosije i arhitektonski profil faza.

### Faza P2: Pilot HBIM model Stibadijuma i paradata prototip (M3–M4)
- **Aktivnosti:**
  1. Izrada detaljnog parametarskog 3D modela reprezentativnog sklopa vile: **Stibadijum sa mozaikom Meduze i nimfejem**.
  2. Implementacija skale pouzdanosti (Nivo A in situ mozaik, Nivo B analogija stubova, Nivo C hipotetički krovni svod).
  3. Izrada prototipa Paradata info-panela (klik na element $\rightarrow$ prikaz arheološkog dokaza).
- **Isporuka:** Interaktivni WebGL/WebGPU demonstrator Stibadijuma spreman za prezentaciju institutu i muzeju.

### Faza P3: Integralni WebGPU arheološki blizanac Medijane (M5–M8)
- **Aktivnosti:**
  1. Modelovanje celokupnog kompleksa: Vila sa peristilom, terme, zgrada sa oktogonom, horreum, ranohrišćanske crkve.
  2. Uvođenje vremenske ose (5 faza: od poljoprivredne vile do savremenog stanja 2026).
  3. Integracija georeferenciranog terena aluvijalne terase Nišave.
  4. Optimizacija scene za prikaz na mobilnim uređajima i radnoj stanici (LOD culling, WebGPU instanciranje).
- **Isporuka:** Puni javni i istraživački digitalni blizanac na platformi Svemira.

### Faza P4: GIS kičma terenskih iskopavanja i edukativni moduli (M9–M12)
- **Aktivnosti:**
  1. Razvoj terenske web GIS aplikacije prilagođene tabletima za arheologe na terenu (direktan unos novih nalaza u CRMarchaeo formatu).
  2. Integracija modula za monitoring konzervatorskog stanja zidova i mozaika.
  3. Razvoj univerzitetskog obrazovnog modula za studente arheologije i arhitekture.
- **Isporuka:** Operativni digitalni radni sistem za tekuća iskopavanja i akreditovani nastavni materijal Univerziteta Svemira.
