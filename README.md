# Supernova

**Supernova. Tiny lessons, big universe.**

A daily science learning app for iOS. Astronomy, chemistry, evolution, and everything in between, taught in about 30 seconds a day.

## The idea

- **Who it's for:** high school and up, skews advanced.
- **What it teaches:** general science, one bite at a time.
- **The daily habit:** a quick fact plus a one-question quiz, one lesson per day.
- **Game layer:** streaks only. No badges, no leaderboards, no clutter.
- **Accounts:** guest mode by default. Sign in with just an email (a 6-digit code, no password) to save your streak permanently.
- **Money:** free to start. A $2.99/month premium tier is planned, not live yet.

## What's in this repo

Built with [Expo](https://expo.dev) (a tool for building iPhone apps with React Native) and [Supabase](https://supabase.com) (accounts + streak storage).

```
supernova-app/
├── App.js              # top-level screen switcher
├── app.json             # app name, icon, and Expo settings
├── eas.json              # cloud build profiles (simulator, preview, production)
├── screens/               # one file per screen (Welcome, Home, Trivia, Streak, Paywall, Settings...)
├── components/            # shared UI pieces (nav bar, sign-in popup)
├── context/                # app-wide state (auth session, light/dark theme)
├── hooks/                   # useStreak, the streak-tracking logic
├── lib/                      # Supabase client, daily lesson picker
├── constants/                 # brand colors, the lesson/question bank
├── styles/                     # shared stylesheet, theme-aware
├── docs/
│   ├── DESIGN.md                # brand colors and fonts
│   ├── app-store-listing.md      # draft App Store Connect copy
│   └── privacy-policy.html        # the live privacy policy page
└── assets/                          # icons and images
```

## How to run this on your own computer

You'll need [Node.js](https://nodejs.org) installed first. Then:

```bash
npm install
npx expo start
```

That opens a QR code. Scan it with the **Expo Go** app on your iPhone (free on the App Store) to see the app live on your own phone.

You'll also need a `.env` file in this folder with two Supabase keys (see `.env.example` for the format), ask Zain for the values, it's kept out of GitHub on purpose.

## Team

- Zain Adtani ([@ZainAdtani](https://github.com/ZainAdtani))
- Farid (collaborator)
