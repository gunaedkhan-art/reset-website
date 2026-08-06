# Reset Privacy Policy

**Last updated:** August 2026  
**Data controller:** Junaed Khan, Greater Manchester, United Kingdom  
**Contact:** [gunaedkhan@gmail.com](mailto:gunaedkhan@gmail.com)  
**Website:** [https://www.resetgoals.com/](https://www.resetgoals.com/)  
**Public URL:** [https://www.resetgoals.com/resetapp/privacy](https://www.resetgoals.com/resetapp/privacy)

## Overview

Reset ("we", "us", "the app") is an Android distraction-intervention app. This policy explains what personal data we collect, why we use it, who we share it with, and your choices.

Reset is intended for adults aged **18 and over**. We do not knowingly collect data from anyone under 18.

## Data we collect

| Data | Purpose |
|------|---------|
| Email address | Account sign-in and support via Supabase Auth |
| Goals (title, reason, target date) | Personalize intervention reflections |
| Distracting app package names | Detect when to trigger an intervention |
| Intervention answers and outcomes | Reflection history and in-app analytics |
| App settings (focus schedule, detection preferences, etc.) | Provide the service you configure |
| Optional Premium coaching text | Personalized closing messages and next-action suggestions when Premium is enabled |
| Feature suggestions (optional) | Improve the product when you submit feedback from the About screen |
| Google Play purchase status | Enable or restore Reset Premium features |

## Data we do not collect

- Screen content, keystrokes, passwords, or text inside other apps
- Contacts, photos, files, or precise location
- Browsing history or message content
- Advertising identifiers or analytics/crash-reporting data (we do not use Firebase Analytics, Sentry, or similar tools)

Detection uses **foreground app package names only** via Android Accessibility (primary) and Usage Stats (fallback). The accessibility service is configured not to read window content (`canRetrieveWindowContent=false`).

## How we use your data

We use your data to:

- Provide and maintain your Reset account
- Run distraction interventions and focus timers
- Store your goals, settings, and history
- Process Premium subscriptions and restore purchases
- Generate optional Premium coaching via our servers and AI provider
- Respond to support requests

We do **not** sell your personal data and we do **not** show ads.

## Legal basis (United Kingdom)

If UK data protection law applies, we rely on:

- **Contract** — to provide the Reset service you sign up for
- **Legitimate interests** — to secure the app, prevent abuse, and improve reliability, balanced against your rights
- **Consent** — where required for optional Premium AI coaching and Android permissions you grant in system settings

## Permissions

- **Accessibility service** — detects when a selected app becomes foreground; package name only
- **Usage access** — fallback foreground detection
- **Notifications** — required foreground-service notification while monitoring is active
- **Internet** — sync with Supabase; Premium coaching API calls
- **Wake lock (optional)** — keep the screen on during focus timers when you enable that setting

## Storage, security, and location

- Account and app data are stored in **Supabase (PostgreSQL)** in the **Canada (ca-central-1)** region, protected by row-level security so each user can access only their own data
- Authentication tokens are handled by Supabase client libraries on your device
- Premium coaching sends intervention context (goal, trigger app, your answers) to our API at **reset-api-fajrsociety.fly.dev** over HTTPS; that service uses **Google Gemini** to generate responses. We do not send your email address to Gemini for coaching

## Data retention and deletion

We retain your data while your account is active.

You can **delete your account in the app** from **Settings → Delete account**. Deletion removes your account and associated data from our database. Some records may remain briefly in encrypted backups and are purged on our providers' normal backup rotation.

Active Google Play subscriptions are managed by Google. Deleting your Reset account does not automatically cancel billing — cancel in **Google Play → Payments & subscriptions** if needed.

## Third parties

| Provider | Role |
|----------|------|
| **Supabase** | Authentication and database hosting (Canada) |
| **Fly.io** | Hosts our Premium coaching API |
| **Google (Gemini)** | Generates Premium coaching text from intervention context |
| **Google Play** | Subscription billing and purchase verification |

We share only what is necessary for these services to operate.

## Subscriptions

Reset Premium is an optional subscription purchased through Google Play. Available plans include **weekly**, **annual** (includes a **3-day free trial** where offered), and optionally **monthly**. Payment is processed by Google; we receive purchase status to unlock Premium features. Cancel anytime in your Google Play account settings.

## Your rights

Depending on where you live, you may have rights to access, correct, delete, or restrict use of your personal data, and to object to certain processing. UK users may also complain to the **Information Commissioner's Office (ICO)**.

To exercise your rights, delete your account in Settings or email **gunaedkhan@gmail.com**.

## International transfers

Your data is stored in Canada (Supabase). Premium coaching may be processed in regions where our API and Google Gemini operate. We use providers that apply appropriate safeguards for cross-border transfers.

## Changes

We may update this policy from time to time. Material changes will be reflected on this page and in the in-app About screen. Continued use of Reset after an update means you accept the revised policy.

## Contact

**Junaed Khan**  
Greater Manchester, United Kingdom  
Email: **gunaedkhan@gmail.com**
