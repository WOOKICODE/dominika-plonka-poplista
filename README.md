# Dominika Płonka — Poplista

One pager zajmujący jeden ekran (100vh, z dopasowaniem 100dvh na telefonach).
Zdjęcie w tle, winyl z dostarczonego wzoru i linki. Wszystkie odsyłają tymczasowo na https://www.instagram.com/plonkadominika/ zgodnie z ustaleniem.

Większy napis Out Now! zmienia kolory, a czarny pasek ma połowę wcześniejszej wysokości. Linki po najechaniu zmieniają kolor na błękitny.
Gwiazdki używają dostarczonego public/Star.svg, mają odcienie różu, mniejszy rozmiar i szerszy rozrzut. Znikają po około sekundzie.
Animacje respektują systemowe ograniczenie ruchu.

Uruchomienie w folderze projektu:

    npm.cmd install
    npm.cmd run dev

Budowanie do publikacji:

    npm.cmd run build

Treść i linki: index.html. Wygląd: src/style.css. Efekt kursora: src/main.js.
Zdjęcia: public/. Grafika winylu jest wycięta z dostarczonego wzoru.


Mobile: dedykowane zdjecie w picture, wersje WebP, wieksza plyta na srodku zdjecia, linki Sklep, Trasa i Instagram na gorze zdjecia w jednym rzedzie z obszarem dotyku 44px. Na ekranach dotykowych brak sztucznego kursora; gwiazdki tylko przy dotknieciu. Kursor myszy: rozowe kolko z obwodka.



