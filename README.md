
# AuthFlow - Secure Authentication with Firebase

This is a modern Next.js project featuring a secure authentication flow integrated with Firebase (Authentication and Firestore).

## Технологический стек (Tech Stack)

1. **Язык программирования (Backend):** TypeScript (Next.js Server Actions & Firebase SDK)
2. **База данных:** Firebase Firestore
3. **Frontend:** React, Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI

## Security & Passwords
- **No Passwords in Database**: This app follows security best practices. Passwords are handled exclusively by Firebase Authentication. We **never** store passwords or password hashes in Firestore.
- **The 'id' Field**: The `id` field in Firestore is the **Firebase UID**, a public-safe unique identifier for the user account.

## Features

- **Email/Password Authentication**: Login, Sign-up, and Password Reset.
- **Google Authentication**: Seamless sign-in using Google accounts.
- **Reactive User Profiles**: User data is synchronized and stored in Firestore.
- **Google reCAPTCHA v2**: Secure bot protection with the "I'm not a robot" checkbox.
- **Modern UI**: Built with ShadCN UI, Tailwind CSS, and Lucide icons.

## Google reCAPTCHA Setup (CRITICAL)

The app is built using **reCAPTCHA v2**. Follow these exact steps:
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).
2. Click "+" to create a new site.
3. **Label**: Enter a descriptive name like `AuthFlow` or `studio-9702333801-bf1fb`.
4. **reCAPTCHA type**: Select **reCAPTCHA v2** and then **"I'm not a robot" Checkbox**. (v3 will NOT work with current code).
5. **Domains**: Add these three domains exactly as shown (one per line):
   - `localhost`
   - `studio-9702333801-bf1fb.firebaseapp.com`
   - `studio-9702333801-bf1fb.web.app`
6. Copy your **Site Key** and replace the one in `src/components/auth/AuthForm.tsx`.

### Troubleshooting: "Timeout (b)" Error
If you see "reCAPTCHA Timeout (b)":
1. **Check Key Version**: Ensure you selected "v2 Checkbox" in the Google console. A v3 key will cause this error.
2. **Check Domains**: Make sure `localhost` and your Firebase domains are authorized in the Google console.
3. **Browser Extensions**: Some ad-blockers can interfere with the Google script. Try disabling them or using Incognito mode.
4. **Refresh**: Sometimes the Google script fails to initialize on the first try in development; a simple browser refresh often fixes it.

## How to View Your Data (Database)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-9702333801-bf1fb**.
3. Go to **Build** > **Firestore Database**.
4. Collection `user_profiles`: Contains user details (Full Name, Email, UID).

## Git Commands

### How to Update GitHub (Pushing your latest changes)
Run these commands whenever you want to push your latest work to GitHub:
```bash
git add .
git commit -m "Describe your changes here"
git push origin main
```

### How to Sync Your Computer (Pulling changes from GitHub)
If you made changes on another computer or directly on GitHub, run this to get them on your local machine:
```bash
git pull origin main
```

### What is a Pull Request?
A **Pull Request (PR)** is created on the GitHub website (not in the terminal). It is used to propose changes from one branch to another, allowing for code review before merging.

## Setup Instructions

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Enable Google Auth**:
   - Go to Firebase Console > Authentication > Sign-in method.
   - Enable **Google**.

3. **Run**:
   ```bash
   npm run dev
   ```
