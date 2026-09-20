# Luna Residence — website

Statični sajt (HTML + JS), spreman za GitHub Pages ili bilo koji static hosting.

## Struktura

- `index.html` — ceo sajt (hero video, galerija sa lightboxom, sadržaji, lokacija, recenzije, FAQ, booking forma, footer, SR/EN prevod)
- `support.js` — runtime koji renderuje stranicu (obavezan, ne brisati)
- `uploads/` — sve fotografije i hero video
- `Luna Residence.dc.html` — izvorni fajl za dalje izmene u editoru (nije potreban za hosting)
- `Luna Residence - Preview.dc.html` — desktop/mobile preview (nije potreban za hosting)

## Objavljivanje na GitHub Pages

1. Napravi novi repozitorijum na GitHub-u.
2. Ubaci sadržaj ovog foldera u koren repozitorijuma (`index.html` mora biti u korenu).
3. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `/ (root)`.
4. Sajt je dostupan na `https://<korisnik>.github.io/<repo>/` za par minuta.

Za sopstveni domen: Settings → Pages → Custom domain (fajl `CNAME` se kreira automatski).

## Napomene

- `.nojekyll` sprečava GitHub Jekyll obradu — ne brisati.
- Stranica učitava React i Google Fonts sa CDN-a, pa je potreban internet pristup.
- Booking forma trenutno samo prikazuje poruku o uspehu. Za slanje mejla poveži je sa servisom tipa FormSubmit:
  u `index.html` nađi `onSubmit="{{ onBook }}"` i dodaj `action="https://formsubmit.co/tvoj@email.com" method="POST"`.

## Placeholderi koje treba zameniti

- cena (`XX €`), udaljenosti (`XX min`), check-in/check-out sati
- Google recenzije (dve kartice označene kao PLACEHOLDER)
- e-mail adresa u footeru
