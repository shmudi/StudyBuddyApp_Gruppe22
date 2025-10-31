# 🚀 StudyBuddy Setup Guide for Collaborators

Dette er en komplett guide for å sette opp StudyBuddy appen med Firebase integration.

## 📋 Forutsetninger

Før du starter, sørg for at du har installert:

- **Node.js** (versjon 16 eller nyere)
- **npm** (kommer med Node.js)
- **Git**
- En moderne nettleser (Chrome, Firefox, Safari, Edge)

## 🔧 Steg 1: Clone Repository

```bash
# Clone repositoryet
git clone https://github.com/shmudi/StudyBuddyApp_Gruppe22.git

# Gå inn i prosjektmappen
cd StudyBuddyApp_Gruppe22

# Bytt til Mikkel branch (hvor Firebase integration er)
git checkout Mikkel
```

## 📦 Steg 2: Installer Dependencies

```bash
# Installer alle npm pakker
npm install

# Installer Expo CLI globalt (hvis du ikke har det)
npm install -g @expo/cli
```

### Viktige pakker som blir installert:
- `expo` - React Native framework
- `firebase` - Firebase SDK
- `@react-native-firebase/app` - Firebase core
- `@react-native-firebase/auth` - Firebase Authentication
- `@react-native-firebase/firestore` - Firebase Firestore database
- `react-navigation` - Navigation system
- `react-native-vector-icons` - Ikoner

## 🔥 Steg 3: Firebase Konfigurasjon

Firebase er allerede konfigurert! Config-filen ligger i:
```
src/config/firebase.ts
```

**Firebase prosjekt:** `studybbudy-73439`

### Firebase tilgang:
1. Be Mikkel om tilgang til Firebase prosjektet
2. Gå til [Firebase Console](https://console.firebase.google.com/)
3. Velg prosjektet "studybbudy-73439"

## 🚀 Steg 4: Kjør Appen

```bash
# Start development server
npx expo start --web

# Appen vil åpne på http://localhost:8081 (eller annen tilgjengelig port)
```

### Hvis du får port-konflikter:
Expo vil automatisk foreslå alternative porter (8082, 8083, etc.)

## 🏗️ Prosjektstruktur

```
StudyBuddyApp_Gruppe22/
├── App.tsx                 # Hovedapp med navigation
├── src/
│   ├── components/         # Gjenbrukbare komponenter
│   │   ├── FormTextInput.tsx
│   │   └── TaskItem.tsx
│   ├── contexts/           # React Context (state management)
│   │   └── AuthContext.tsx # Firebase authentication
│   ├── navigation/         # Navigation setup
│   │   └── TabNavigator.tsx
│   ├── screens/            # App skjermer
│   │   ├── CalendarScreen.tsx
│   │   ├── FocusModeScreen.tsx
│   │   ├── GroupsScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   └── Login/
│   │       ├── LoginScreen.tsx
│   │       ├── RegisterScreen.tsx
│   │       └── ForgotPasswordScreen.tsx
│   ├── services/           # Firebase services
│   │   ├── auth.ts         # Authentication service
│   │   └── tasks.ts        # Tasks/Firestore service
│   ├── config/             # Konfigurasjon
│   │   └── firebase.ts     # Firebase config
│   └── theme/
│       └── colors.ts       # App farger
├── assets/                 # Bilder og ikoner
└── package.json           # Dependencies
```

## 🔐 Authentication Flow

1. **App starter** → Sjekker om bruker er logget inn
2. **Ikke logget inn** → Viser login-skjerm
3. **Logget inn** → Viser hovedapp med tabs

### Test kontoer:
Du kan opprette nye kontoer eller be Mikkel om test-credentials.

## 📱 App Funksjoner

### Tabs (hovednavigation):
- **Kalender** - Kalender visning
- **Oppgaver** - Oppgaveliste med Firebase sync
- **Grupper** - Gruppe funksjonalitet
- **Fokus** - Fokus modus
- **Innstillinger** - Bruker profil og logout

### Firebase Integration:
- ✅ **Authentication** - Login/registrering/logout
- ✅ **Firestore Database** - Oppgaver lagres i skyen
- ✅ **Real-time sync** - Endringer oppdateres automatisk

## 🛠️ Utvikling

### Viktige filer å kjenne til:

**Firebase Services:**
- `src/services/auth.ts` - Håndterer login/registrering
- `src/services/tasks.ts` - Håndterer oppgaver i Firestore

**Main Components:**
- `src/contexts/AuthContext.tsx` - Authentication state
- `src/screens/TasksScreen.tsx` - Oppgaveliste med Firebase
- `App.tsx` - Hovednavigation og auth routing

### Legge til nye funksjoner:
1. Opprett nye screens i `src/screens/`
2. Legg til navigation i `TabNavigator.tsx`
3. Opprett Firebase services hvis nødvendig

## 🔍 Testing

### Test Firebase integration:
1. **Registrer ny bruker** - sjekk at konto opprettes
2. **Logg inn/ut** - test authentication flow
3. **Legg til oppgaver** - sjekk at de lagres i Firestore
4. **Navigasjon** - test alle tabs

### Debug tips:
- Åpne browser Developer Tools (F12) for console logs
- Sjekk Firebase Console for data
- Test på forskjellige nettlesere

## 🚨 Vanlige Problemer

### "Port is being used"
Expo vil foreslå alternative porter automatisk.

### Firebase connection issues
Sjekk at du har internett og Firebase config er riktig.

### npm install fails
Prøv:
```bash
npm cache clean --force
npm install
```

### Build errors
Prøv:
```bash
npx expo start --web --clear
```

## 📞 Få Hjelp

- Spør Mikkel om Firebase tilgang
- Sjekk [Expo dokumentasjon](https://docs.expo.dev/)
- Sjekk [Firebase dokumentasjon](https://firebase.google.com/docs)

## 🎉 Du er klar!

Når alt er satt opp, kan du:
1. Kjøre `npx expo start --web`
2. Åpne appen i nettleser
3. Teste alle funksjoner
4. Begynne å utvikle nye features!

---

**Happy coding! 🚀**