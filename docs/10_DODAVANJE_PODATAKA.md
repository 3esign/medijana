# 10 · Dodavanje podataka — kako se sistem dopunjuje

Suite je izveden iz registara u `data/*.jsonl`. Stranice, 3D maketa, brojke i
kartice čitaju registre u hodu — za nov podatak se **ne menja HTML ni motor**,
dodaje se linija u odgovarajući registar i prolazi provera.

## Tok za nov podatak

1. **Izvor prvo.** Nova bibliografska jedinica ide u `IZVORI.jsonl`;
   veza izvor→tvrdnja u `VEZE_IZVORA.jsonl` (status: `kandidat`,
   `potvrdjena_veza` ili `blokirano`, uz `basis`, `note`, `checked_at`).
2. **Zapis.** Nova linija u registar (`GEOMETRIJA`, `HIPOTEZE`, `PITANJA`…),
   sa jedinstvenim `id`. Svako polje mere nosi poreklo kroz `pouzdanost`.
3. **Provera.** `node tools/proveri-registre.cjs` — JSON parsiranje, duplikati,
   reference izvora i hipoteza, i oblik+dimenzije svakog prikazanog
   geometrijskog zapisa (isti kod kao u pregledaču).
4. **Suite.** `node tools/proveri-suite.cjs` — skelet stranica, veze, meta.
5. **GLB.** Ako je menjana geometrija: regeneriši `modeli/medijana.glb`
   (`tools/blizanac_blender.py`) i proveri render kroz `tools/cdp-provera.cjs`.

## Nov 3D element (GEOMETRIJA.jsonl)

Obavezna polja: `id`, `naziv`, `tip` (`gradjevina`/`instalacija`/`kolonada`/`trem`/`teren`),
`oblik`, `dim`, `pos` `[x,z]` u metrima, `rot_deg`, `visina_rek_m`,
`visina_sacuvana_m`, `pouzdanost`, `polozaj`, `napomena`, `izvori`, `hipoteze`.

Klase pouzdanosti: `objavljena_dimenzija` · `izvedeno_iz_povrsine` · `sematski`.
Sporan identitet: `prikaz: false` — zapis ostaje u registru, izlazi iz prikaza.

## Nov oblik geometrije

Jedino mesto: **`assets/scena/oblici.js`**. Dodaj ključ u `OBLICI` sa:
- `polja`: obavezna numerička polja u `dim` (validator ih traži),
- `gradi(ctx)`: crtanje u grupu; `ctx` nosi `THREE`, `dodaj`, `kutija`, `D`, `h`.

Motor (`assets/scena.js`) se ne dira: ivice u boji dokaza, kontaktna senka,
natpis, kadar i dosije rade za svaki oblik automatski. Nepoznat oblik pada
na validatoru i upozorava u konzoli — nikad tiho.

## Dvojezičnost

SR je izvor; EN stranice su paralelne (`index-en.html`). Natpisi 3D objekata
čitaju `naziv` iz registra; za engleske natpise dodaje se `naziv_en` polje
(planirano za P2) — motor će ga pokupiti kroz `opcije.jezik`.
