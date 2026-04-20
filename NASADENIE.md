# STRIKER SALES - Nasadenie s backend emailom

## Štruktúra súborov
```
striker-sales-v2/
├── index.html
├── netlify.toml
└── netlify/
    └── functions/
        ├── send-email.js
        └── package.json
```

## Kroky nasadenia

### 1. GitHub repozitár
- Vytvor GitHub účet na github.com
- Nový repozitár: "striker-sales"
- Nahraj všetky súbory

### 2. Netlify - napoj na GitHub
- app.netlify.com → Add new site → Import from Git
- Vyber GitHub → striker-sales repozitár
- Build command: (nechaj prázdne)
- Publish directory: (nechaj prázdne alebo ".")
- Klikni Deploy

### 3. Environment variables (SMTP heslá)
- Netlify dashboard → striker-sales → Site settings → Environment variables
- Pridaj:
  SMTP_USER = your-email@example.com
  SMTP_PASS = [tvoje IONOS heslo]

### 4. Redeploy
- Po nastavení env variables: Deploys → Trigger deploy

## Hotovo!
- Frontend volá /.netlify/functions/send-email
- Email sa odosiela cez IONOS SMTP
- SMTP heslo nie je viditeľné v kóde
- your-email@example.com
