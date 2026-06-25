# Setup Guide - Integration med eksisterende Repo

## Trin 1: Backup dine nuværende filer

```bash
cd ~/Documents/Nordcomply/nordcomply-portal
git status
git commit -m "Backup før redesign"
git push
```

## Trin 2: Kopier nye filer til din repo

1. **Kopier hele `frontend/src` mappen:**
```bash
cp -r ~/nordcomply-new/src/* frontend/src/
cp ~/nordcomply-new/public/index.html frontend/public/
```

2. **Kopier root config-filer:**
```bash
cp ~/nordcomply-new/.env.example .
cp ~/nordcomply-new/.gitignore .
cp ~/nordcomply-new/README.md .
```

3. **Opdater package.json:**
```bash
cp ~/nordcomply-new/package.json .
```

## Trin 3: Installer dependencies

```bash
cd frontend
npm install
```

## Trin 4: Setup Google OAuth

1. Gå til https://console.cloud.google.com/
2. Opret et nyt projekt
3. Aktivér "Google+ API"
4. Gå til "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Vælg "Web application"
6. Tilføj authorized redirect URIs:
   - `http://localhost:3000`
   - `https://portal.nordcomply.dk`
   - `https://de74ad9f.nordcomply.pages.dev` (din preview URL)
7. Kopier Client ID

## Trin 5: Sæt miljøvariabler

```bash
cp .env.example frontend/.env.local
```

Åbn `frontend/.env.local` og indsæt:
```
REACT_APP_GOOGLE_CLIENT_ID=din-client-id-her.apps.googleusercontent.com
```

## Trin 6: Test lokalt

```bash
cd frontend
npm start
```

Besøg `http://localhost:3000`

## Trin 7: Push til GitHub

```bash
cd ~/Documents/Nordcomply/nordcomply-portal
git add .
git commit -m "Redesign with Google OAuth login"
git push
```

CloudFlare Pages deployer automatisk!

## Trin 8: Sæt Google Client ID i CloudFlare Pages

1. CloudFlare Dashboard → portal.nordcomply.dk
2. Settings → Environment variables
3. Tilføj:
   - Name: `REACT_APP_GOOGLE_CLIENT_ID`
   - Value: `din-client-id-her.apps.googleusercontent.com`
4. Deploy

## Tjekliste

- [ ] Google Cloud Project oprettet
- [ ] Google OAuth Client ID genereret
- [ ] `.env.local` oprettet med Client ID
- [ ] `npm install` kørt
- [ ] `npm start` virker lokalt
- [ ] Landing page vises korrekt
- [ ] Google Login button vises
- [ ] Pushed til GitHub
- [ ] CloudFlare Pages deployer
- [ ] Google Client ID sat i CloudFlare environment

## Troubleshooting

### Google Sign-In button vises ikke
- Check at `REACT_APP_GOOGLE_CLIENT_ID` er sat i `.env.local`
- Hard refresh browser (Ctrl+Shift+Delete)
- Check Browser Console (F12) for fejl

### Login virker ikke på CloudFlare Pages
- Verificer at Google Client ID er sat i CloudFlare environment variables
- Check at authorized redirect URI inkluderer `https://de74ad9f.nordcomply.pages.dev`

### API endpoints virker ikke
- Check at CloudFlare Workers deployment virker
- Verificer `/api/tenants` returnerer data
- Check browser Network tab (F12 → Network)

## Næste Steps

1. **Test tenant import** - Brug en test-tenant med Global Admin
2. **Implementer Secure Score display** - Dashboard skal vise scores
3. **Tilføj MFA status** - Admin panel skal vise MFA adoption
4. **Conditional Access** - Vis policy status

Lykke til! 🚀
