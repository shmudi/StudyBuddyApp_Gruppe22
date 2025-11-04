# 🔥 Firebase Oppsett - Steg for Steg Guide

## ✅ Steg 1: Opprett Firebase-prosjekt

**Du har Firebase Console åpen i browseren din. Følg disse stegene:**

### 1.1 Opprett nytt prosjekt
1. Klikk på **"Create a project"** eller **"Add project"**
2. Gi prosjektet navnet: **"StudyBuddy"** (eller ønsket navn)
3. Klikk **"Continue"**

### 1.2 Google Analytics (valgfritt)
1. Du kan skru av Google Analytics for nå (ikke nødvendig for utvikling)
2. Klikk **"Create project"**
3. Vent på at prosjektet opprettes (kan ta et minutt)

### 1.3 Gå til prosjekt-dashboard
- Klikk **"Continue"** når prosjektet er klart
- Du er nå i Firebase Console for ditt nye prosjekt

---

## ✅ Steg 2: Legg til Web App til Firebase-prosjektet

### 2.1 Registrer Web App
1. I Firebase Console, på **Project Overview** siden
2. Klikk på **Web-ikonet** `</>` (tredje ikon fra venstre)
3. Registrer appen:
   - **App nickname**: `StudyBuddy Web`
   - **Hosting**: La denne være **av** for nå
   - Klikk **"Register app"**

### 2.2 Kopier Firebase-konfigurasjon
Firebase viser deg nå konfigurasjonskoden som ser slik ut:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "studybuddy-xxxxx.firebaseapp.com",
  projectId: "studybuddy-xxxxx",
  storageBucket: "studybuddy-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 2.3 Oppdater din app-konfigurasjon
1. **KOPIER** verdiene fra Firebase Console
2. Åpne filen: `src/config/firebase.ts` i VS Code
3. **ERSTATT** placeholder-verdiene med dine faktiske verdier:

```typescript
const firebaseConfig = {
  apiKey: "DIN_FAKTISKE_API_KEY",           // Fra Firebase Console
  authDomain: "ditt-prosjekt.firebaseapp.com",  // Fra Firebase Console  
  projectId: "ditt-prosjekt-id",           // Fra Firebase Console
  storageBucket: "ditt-prosjekt.appspot.com",   // Fra Firebase Console
  messagingSenderId: "din-sender-id",      // Fra Firebase Console
  appId: "din-app-id"                      // Fra Firebase Console
};
```

### 2.4 Fullfør Firebase Web App setup
- Klikk **"Continue to console"** i Firebase
- Du er nå klar for neste steg!

---

## 📋 Hva du har oppnådd

✅ **Firebase-prosjekt opprettet**  
✅ **Web App registrert**  
✅ **Konfigurasjon kopiert**  
✅ **App konfigurert med Firebase**  

## 🎯 Neste steg (gjøres automatisk senere)

3. ⏳ Aktiver Authentication (Email/Password)
4. ⏳ Opprett Firestore Database  
5. ⏳ Sett opp Security Rules
6. ⏳ Test registrering og innlogging

---

## 🆘 Feilsøking

**Problem**: Kan ikke finne Firebase-konfigurasjon?
- Gå til Firebase Console → **Project Settings** (tannhjul-ikon) → **General** → **Your apps**

**Problem**: App kompilerer ikke?
- Sjekk at alle verdier i `firebaseConfig` er fylt ut riktig
- Ingen verdier skal inneholde "your-" eller "din-"

**Problem**: "Firebase not configured" feil?
- Sørg for at du har oppdatert `src/config/firebase.ts` med ekte verdier fra Firebase Console