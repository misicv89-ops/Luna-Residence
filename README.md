# Luna Residence — website

Statični sajt (HTML + JS + assets), spreman za GitHub Pages ili bilo koji static hosting.
Nema build koraka, nema npm-a — fajlovi se serviraju kakvi jesu.

## Struktura

```
/
├── index.html      ceo sajt (sve sekcije, logika, stilovi)
├── support.js      runtime koji renderuje stranicu — OBAVEZAN
├── uploads/        sve fotografije (.jpg/.jpeg) + hero video (.mp4)
├── .nojekyll       isključuje Jekyll obradu na GitHub Pages
├── README.md       ovo uputstvo
└── preview.html    desktop/mobile pregled (opciono, može se obrisati)
```

## Objavljivanje na GitHub Pages

1. Napravi repozitorijum i ubaci sadržaj ovog foldera u njegov koren (`index.html` mora biti u korenu).
2. Settings → Pages → Source: *Deploy from a branch*, Branch: `main` → `/ (root)`.
3. Sajt je živ na `https://<korisnik>.github.io/<repo>/` za par minuta.

Sopstveni domen: Settings → Pages → Custom domain.

## Šta sadrži

- Sticky navbar (ivory pozadina pri skrolu), SR/EN prekidač, CTA "Rezerviši" (poziva 060 4570545)
- Hero sa video pozadinom (autoplay, muted, loop, playsinline — radi i na iOS/Android), gradient overlay, CTA "Istraži apartman" i booking panel (Dolazak / Odlazak / Gosti)
- Quick features, O apartmanu, Galerija sa fullscreen lightboxom (35 fotografija), Sadržaji, "Sve na jednom mestu" (01–04), Lokacija sa Google mapom, Recenzije (rotirajuće, pause/prev/next), FAQ akordeon, Booking forma, Final CTA, Footer
- Animacije: scroll reveal, fade-up, stagger, hover zoom, parallax, smooth scroll, akordeon i lightbox tranzicije
- Responsive: desktop / tablet / mobilni (video ostaje i na mobilnom)

## Booking forma → FormSubmit

Forma trenutno prikazuje poruku o uspehu bez slanja. Za slanje mejla, u `index.html` nađi:

```html
<form onSubmit="{{ onBook }}"
```

i dodaj:

```html
action="https://formsubmit.co/tvoj@email.com" method="POST"
```

Imena polja su već spremna: `checkin`, `checkout`, `guests`, `name`, `phone`, `email`, `message`.

## Placeholderi za zamenu

- cena `XX €`, udaljenosti `XX min`, check-in/check-out sati
- dve Google recenzije označene kao PLACEHOLDER
- e-mail adresa u footeru

## Napomene

- Stranica učitava React i Google Fonts sa CDN-a — potreban je internet.
- `.nojekyll` i `support.js` ne brisati.
