# 08 · Objava: kontrolna lista i granice

Stanje: **repozitorijum je privatan.** Sve iz liste ispod je pripremljeno i proverava se automatski; preostaju tri koraka koje pokreće Semir svesno, jer menjaju vidljivost (odeljak 3).

---

## 1. Šta je spremno i čime se to proverava

| Deo | Fajl | Automatska provera |
|---|---|---|
| Licenca koda | `LICENSE` (MIT) | `proveri-suite.cjs` — postojanje |
| Licenca sadržaja | `LICENSE-CONTENT` (CC BY 4.0, sa izgovorenim granicama) | isto |
| Citiranje | `CITATION.cff` | isto |
| Zenodo metapodaci | `.zenodo.json` | isto + JSON parsira |
| Pages bez Jekyll obrade | `.nojekyll` | isto |
| Indeksiranje | `robots.txt`, `sitemap.xml` (8 stranica, izvodi se iz `pripremi-launch.cjs`) | `proveri-suite.cjs` — sitemap pokriva svaku stranicu |
| Social/SEO kartica | og/twitter/canonical/favicon/hreflang blok na svih 8 stranica | `proveri-suite.cjs` — svaki tag, tačan canonical |
| Stranica greške | `404.html` (noindex, puna navigacija) | isto |
| Navigacija | isti redosled i tačno jedan `aria-current` svuda | isto |
| Lokalne veze | 122 `href`/`src` putanje u HTML-u i 47 u Markdown-u | isto — svaka mora postojati, nijedna ne vodi u `private/` |
| Dvojezičnost | `index.html` (sr) ↔ `index-en.html` (en), uzajamni `hreflang` | `proveri-suite.cjs` |
| Privatni materijal | `docs/private/` + `.gitignore` | isto — nijedna veza ne vodi u `private/`, ni taktika ni neposlat predlog nisu u `docs/` |
| Registri | 10 JSONL, 115 zapisa, 14 geometrijskih elemenata | `proveri-registre.cjs` |
| Isključen sporni oktogon | `prikaz:false`, odsutan iz GLB | `proveri-registre.cjs` (tvrda tvrdnja) |
| CI | `.github/workflows/registries.yml`, `pages.yml` | Pages se ne isporučuje ako provera padne |

Pokretanje lokalno:

```
node tools/proveri-registre.cjs
node tools/proveri-suite.cjs
```

## 2. Šta je sklonjeno iz javnog materijala

- **Pregovaračka priprema** („zlatno pravilo prvog kontakta“, pozicioniranje pred institucijama) prebačena iz javnog `docs/03` u `docs/private/03a_PRVI_KONTAKT.md`. Razlog: institucija ne treba da pročita naš pristup razgovoru na vebu pre razgovora.
- **Protokol i radni paket za Institut** (nekadašnji `docs/07`) prebačen ceo u `docs/private/`. To je neposlat predlog upućen imenovanim ustanovama, sa specifikacijom traženih podataka i predloženim režimom prava i embarga; objavljuje se tek ako i kada institucije na to pristanu. README o njemu govori, ali ne vezuje fajl.
- Oboje je izuzeto `.gitignore`-om i proverava se automatski.
- **Javni `docs/03` zadržava** mapu institucija i nadležnosti, javno objavljene iznose konkursa (Ministarstvo kulture, Fond za nauku, Creative Europe, Horizon Europe) i faze P1–P4. To su javni podaci programa, ne naša strategija.

## 3. Preostala tri koraka — Semirova odluka

Pokreću se zajedno, kad kaže:

1. **Istorija repozitorijuma.** Pregovarački tekst (`docs/03`) i ceo protokol (`docs/07`) postoje u već pushovanim commit-ovima. Dok je repo privatan, to je bez posledica; **javni repo izlaže i istoriju.** Preporuka: pre javnog prelaska prepisati istoriju (`git filter-repo` ili squash u jedan P1 commit) — repo nema saradnike, pa je force-push bezbedan. Alternativa je prihvatiti da taj odeljak ostaje u istoriji.
2. **Javni repo + Pages.** `Settings → Visibility → Public`, pa `Settings → Pages → Source: GitHub Actions`. Workflow `pages.yml` isporučuje suite na `https://3esign.github.io/medijana/`.
3. **Prvi release + Zenodo DOI.** Tag `v0.1-p1` → GitHub release; Zenodo veza na repo povlači `.zenodo.json` i dodeljuje DOI. DOI se posle upisuje u `CITATION.cff` (`doi:`), `README` i `.zenodo.json` (`related_identifiers`).

## 4. Granice koje objava ne menja

- Hipoteze M-H01–M-H10 ostaju **NEPROVERENO**; objava nije validacija.
- Prostorni raspored i visine su **šematski**; mapa nije geodetski snimak.
- Nema sporazuma sa institucijama — ovaj materijal je priprema za razgovor, ne njegov rezultat.
- Ništa neobjavljeno iz tekućih kampanja (2024–2026) nije u repozitorijumu i ne ulazi pre zvanične publikacije istraživača.
