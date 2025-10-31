# Firebase Setup for StudyBuddy App

For å få Firebase til å fungere med StudyBuddy-appen, må du følge disse stegene:

## 1. Opprett Firebase-prosjekt

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Klikk "Create a project" eller "Legg til prosjekt"
3. Gi prosjektet navnet "StudyBuddy" (eller ønsket navn)
4. Følg setup-veilederen

## 2. Legg til Web App

1. I Firebase Console, klikk på "Web" ikonet (</>) 
2. Registrer appen med navnet "StudyBuddy Web"
3. Kopier Firebase-konfigurasjonen som vises

## 3. Oppdater Firebase-konfigurasjon

Rediger `src/config/firebase.ts` og erstatt placeholder-verdiene med dine faktiske Firebase-konfigurasjonsverdier:

```typescript
const firebaseConfig = {
  apiKey: "din-api-key-her",
  authDomain: "ditt-prosjekt.firebaseapp.com",
  projectId: "ditt-prosjekt-id",
  storageBucket: "ditt-prosjekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "din-app-id"
};
```

## 4. Aktiver Authentication

1. I Firebase Console, gå til "Authentication"
2. Klikk "Get started"
3. Under "Sign-in method", aktiver:
   - **Email/Password** (påkrevd)
   - Andre metoder etter behov

## 5. Opprett Firestore Database

1. I Firebase Console, gå til "Firestore Database"
2. Klikk "Create database"
3. Velg "Start in test mode" (for utvikling)
4. Velg en region nær deg

## 6. Sett opp Firestore Security Rules

Etter testing, oppdater Firestore-reglene for produksjon:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Brukere kan kun lese/skrive sine egne dokumenter
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Oppgaver - brukere kan kun se sine egne
    match /tasks/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Test appen

1. Start appen: `npx expo start`
2. Registrer en ny bruker
3. Test innlogging/utlogging
4. Test opprettelse og redigering av oppgaver

## Databsestruktur

### Users Collection
```
users/{userId}
- id: string
- email: string
- fullName: string
- username: string
- createdAt: timestamp
```

### Tasks Collection
```
tasks/{taskId}
- id: string (auto-generated)
- title: string
- course?: string
- due?: string
- done: boolean
- userId: string
- createdAt: timestamp
- updatedAt: timestamp
```

## Fremtidige funksjoner

Du kan enkelt utvide med:
- Gruppe-funksjoner (delte oppgaver)
- Kalender-integrasjon med Firestore
- Push-notifikasjoner
- Offline-support med Firestore caching
- Fil-opplasting til Firebase Storage

## Feilsøking

- Sjekk at alle Firebase-konfigurasjonsverdier er korrekte
- Kontroller at Authentication og Firestore er aktivert
- Se browser/expo console for feilmeldinger
- Sjekk Firebase Console under "Usage" for aktivitet