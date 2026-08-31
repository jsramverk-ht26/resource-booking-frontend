# resource-booking-frontend

Referensimplementation för **DV1677 HT26** — frontend till ett bokningssystem för resurser.
Byggd med React 18 och Vite.

> **OBS — läs detta först**
>
> Det här repot är ett *referensexempel*, inte en facit eller mall att kopiera.
> Det visar ett sätt att implementera flera av kursens projektkrav, men exakt
> hur ni löser dem i ert eget projekt är upp till er. Viss funktionalitet kan
> saknas, vara förenklad eller skilja sig från vad kursens krav specifikt efterfrågar.
>
> Krav 5 (notifieringar) och Krav 6 (Proxmox API) är **inte implementerade** i det här repot.

## Projektkrav som demonstreras

| Krav | Demonstration | Var i koden |
|------|---------------|-------------|
| Krav 1 – Autentisering | Inloggning, registrering, skyddade rutter | `src/context/AuthContext.jsx` |
| Krav 2 – Realtid | Realtidsuppdatering av bokningskalender | `src/hooks/useSocket.js` |
| Krav 4 – Kommentarer | Kommentarer på bokningar | `src/components/comments/` |
| Krav 5 – Notifieringar | **Ej implementerat** | — |
| Krav 6 – Proxmox API | **Ej implementerat** | — |

## Kom igång

```bash
cp .env.example .env.local   # sätt VITE_API_URL
npm install
npm run dev
```

## Miljövariabler

| Variabel | Beskrivning |
|----------|-------------|
| `VITE_API_URL` | URL till backend-API:t |

## Driftsättning

Frontend deployas automatiskt till GitHub Pages vid push till `main`.
Sätt `VITE_API_URL` som repo-secret på GitHub.
