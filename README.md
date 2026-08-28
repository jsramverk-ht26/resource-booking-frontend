# resource-booking-frontend

Referensimplementation frontend — DV1677 HT26

## Stack

React 18, Vite, react-router-dom, socket.io-client

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

## Deploy

Frontend deployas automatiskt till GitHub Pages vid push till `main`.
Sätt `VITE_API_URL` som repo-secret på GitHub.
