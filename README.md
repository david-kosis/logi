# Kora authentication page

React + Vite sign-in and sign-up interface with Google and GitHub OAuth using Firebase Authentication.

## Install

```bash
npm install
```

## Configure Firebase

1. Create a project at https://console.firebase.google.com/ and add a Web App.
2. Open **Authentication → Sign-in method** and enable **Google**.
3. Enable **GitHub** in the same screen.
4. In Firebase's GitHub provider settings, copy the displayed OAuth callback URL.
5. At https://github.com/settings/developers create a GitHub OAuth App. Set its Authorization callback URL to the exact URL Firebase displays.
6. Copy the GitHub OAuth App Client ID and Client Secret into the GitHub provider settings in Firebase, then save.
7. In Firebase Authentication → Settings → Authorized domains, add `localhost` and your deployed website domain.

**Never put the GitHub OAuth Client Secret in this frontend repository.** It belongs only in Firebase Console.

## Add the Firebase web configuration

Copy `.env.example` to `.env` and fill in the Firebase Web App values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

The Firebase web config is intended for browser use. Do not put private OAuth client secrets in `VITE_*` variables.

## Run

```bash
npm run dev
```

Restart the Vite server after editing `.env`.

For deployment, add the same four `VITE_FIREBASE_*` variables to your hosting provider and redeploy. Add the deployed domain to Firebase's Authorized domains.

A user's first successful Google or GitHub sign-in automatically creates their Firebase Authentication account. Firebase also manages the signed-in session.

Email/password forms are currently UI-only and intentionally do not pretend to authenticate. Connect a trusted backend or enable Firebase Email/Password before using those forms.

Official guides:
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/auth/web/github-auth
