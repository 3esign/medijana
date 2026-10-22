# Vizuelne provere (ručno, u pregledaču)

Statički server iz korena suite-a, pa:

- `tools/provera/preliv.html` — svaka stranica u 390px okviru; ispisuje `scrollWidth`
  i elemente koji izlaze iz vidnog polja. Pokazatelj je `scrollWidth`: vrednost veća
  od 390 znači vodoravni preliv. Fiksni HUD u `blizanac.html` i Leaflet pločice u
  `mapa.html` legitimno izlaze iz okvira jer su isečeni, ne pomeraju stranu.
- `tools/provera/mobilni.html?p=index,mapa,registri` — izabrane stranice jedna pored
  druge u 390px okvirima, za pregled okom.

Headless snimak direktno na `--window-size=390,900` **nije** merodavan za mobilni:
bez emulacije uređaja Chrome ignoriše viewport meta i iseca desktop raspored.
Zato ove provere idu kroz iframe širine 390px.
