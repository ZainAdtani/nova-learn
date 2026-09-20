# NovaLearn — App Status

Read-only audit. No code was changed. This is a plain-English snapshot of what exists in this repo today.

---

## 1. What it's built with

- **React Native + Expo** (managed workflow, Expo SDK 57). This is the standard way to build one codebase that runs as a real iPhone (and Android) app.
- **JavaScript**, not TypeScript. No `.ts`/`.tsx` files anywhere.
- **Supabase** for the backend: handles sign-in (email + 6-digit code, no password) and stores each signed-in user's streak count.
- No native iOS/Android project folders (`ios/`, `android/`) exist yet. Expo builds those for you in the cloud when you're ready (via `eas.json`, which is already set up with simulator/preview/production build profiles).
- No test files and no CI pipeline (no GitHub Actions, no automated checks). Nothing runs automatically to catch bugs before they ship.

## 2. What screens and features work today

The app has 7 screens, wired together in `App.js` as a simple state machine (no navigation library):

| Screen | What it does |
|---|---|
| **Welcome** | Animated logo intro, "Get Started" button |
| **Notify** | Asks to turn on daily reminders (button exists, but see gap below) |
| **Home** | Shows today's science fact card + a peek at tomorrow's, plus the streak count |
| **Trivia** | One multiple-choice question tied to today's fact, shows right/wrong and an explanation |
| **Streak** | Shows the current streak number and a "See Plans" button |
| **Paywall** | Shows the $2.99/mo Plus pitch (not connected to real payment, see below) |
| **Settings** | Light/dark/system theme toggle, sign in/out |

Working end-to-end:
- **Daily lesson rotation** — 20 science lessons in `constants/lessons.js`, one picked per calendar day so everyone sees the same lesson on the same day.
- **Streak counting** — if you do a quiz today and did one yesterday, your streak goes up by 1. Miss a day, it resets to 1. This works for both guests (saved on your phone) and signed-in users (saved in Supabase).
- **Guest mode** — you can use the whole app without an account.
- **Save your streak later** — after your first quiz as a guest, a popup offers to save your streak by email. Sign in later and your guest streak transfers to your account instead of getting wiped.
- **Light/dark/system theme** — works and is remembered.

## 3. What's broken, missing, or half done

- **No safe-area handling anywhere.** The app never uses `SafeAreaView` or the safe-area library. That's the root cause of bug 4a below, and it likely affects every screen's top edge, not just Home.
- **Payments aren't real.** Tapping "Subscribe" on the Paywall screen just shows a popup that says "Coming soon." There's no Apple in-app-purchase code at all yet.
- **No delete-account option in the app.** Settings only offers sign out. Apple requires apps that let you create an account to also let you delete it from inside the app, not just "email us." This will likely get your app rejected at review as-is.
- **Notification permission button doesn't request anything.** "Yes, remind me" on the Notify screen just moves to the next screen — it doesn't actually ask iOS for notification permission or schedule anything. The promise ("we'll nudge you once a day") isn't backed by code yet.
- **Naming is inconsistent.** The app displays as "NovaLearn" on-screen and in `app.json`, but the App Store listing draft, the brand doc, the bundle ID (`com.adtaniedu.supernova`), and the URL scheme still all say "Supernova." Needs a pass to make it consistent everywhere, or a decision to keep the technical name as Supernova and only the display name as NovaLearn.
- **Privacy policy is an unfinished draft.** It still has `[fill in date]` and `[support email]` placeholders, still says "Supernova," and isn't hosted anywhere public yet (it's just a file in this repo).
- **All correct quiz answers are the first option.** Every one of the 20 lessons has `correct: 0`. Fine for now, but a repeat user will notice the pattern within a few days.
- **No database schema in this repo.** The `profiles` table that stores streaks lives only inside Supabase itself — there's no migration file here, so if that table ever gets deleted or misconfigured, there's nothing in Git to rebuild it from.
- **No error handling for a failed network call.** If Supabase is unreachable (bad wifi, etc.), sign-in and streak-saving will likely fail silently or throw without a friendly message.
- **No app icon variety.** Only a single 1024×1024 icon exists — fine for App Store submission, but there's no adaptive icon setup called out for Android if you ever ship there too.

## 4. The two bugs you saw

**a. Home screen title/streak overlap the clock and Dynamic Island**
Confirmed. `screens/HomeScreen.js` puts the header row (title + 🔥 streak pill) inside a `ScrollView` with only 20px of padding — nothing accounts for the iPhone's status bar or Dynamic Island. Because the app never uses `SafeAreaView` anywhere (see #3 above), the header draws underneath the system clock/island instead of below it.
*Fix scope: small. Wrap the app (or at least each screen) in a safe-area container so content starts below the notch, on every screen, not just Home.*

**b. Streak screen says "1 days" instead of "1 day"**
Confirmed. `screens/StreakScreen.js` line 11 hardcodes the word "days": `{streak} days`. It never checks whether the count is exactly 1.
*Fix scope: tiny. One line, add singular/plural logic.*

## 5. What's still needed before App Store submission

| Item | Status |
|---|---|
| App icon | ✅ Done — 1024×1024 PNG exists |
| Privacy policy | ⚠️ Drafted but not finished or hosted publicly (Apple requires a live URL) |
| App Store listing copy | ✅ Drafted in `docs/app-store-listing.md`, ready to review and paste in |
| In-app account deletion | ❌ Missing — required by Apple if you offer account creation |
| Real payments for Plus | ❌ Missing — Paywall is a mockup only, no StoreKit/IAP wired up |
| Push notification permission | ❌ Missing — button doesn't request permission or schedule anything |
| Screenshots for App Store Connect | ❌ Not yet captured |
| Support URL | ❌ Needs a real live page |
| App Store Connect account / bundle ID registered | Unknown — not visible from this repo, confirm in your Apple Developer account |
| Safe-area / notch fix | ❌ The bug in #4a above should be fixed before screenshots are taken |
| Testing on a real device | Unknown — no evidence of TestFlight or device testing in this repo |

## 6. Top 3 next steps, ranked by impact

1. **Fix the safe-area bug across the whole app**, not just Home. This is the single most visible "looks broken" issue and it's cheap to fix. Do this before you take App Store screenshots, or you'll have to retake them.
2. **Finish and host the privacy policy, and add in-app account deletion.** Both are hard blockers for App Store approval, not nice-to-haves. Apple will reject the app without them if sign-in is live.
3. **Decide on payments now, even if you don't build them yet.** You can submit to Apple with Plus turned off (keep the "Coming soon" behavior) and ship v1 as free-only. But make that a decision, not a default, since the App Store listing and Paywall screen currently promise a feature that doesn't exist.
