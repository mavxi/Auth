
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
- **Google reCAPTCHA**: Secure bot protection on all auth forms.
- **Modern UI**: Built with ShadCN UI, Tailwind CSS, and Lucide icons.

## Google reCAPTCHA Setup

To use your own reCAPTCHA keys:
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).
2. Choose **reCAPTCHA v2 ("I'm not a robot" Checkbox)**.
3. Add these **Domains**:
   - `localhost`
   - `studio-9702333801-bf1fb.firebaseapp.com`
   - `studio-9702333801-bf1fb.web.app`
4. Copy your **Site Key** and replace the one in `src/components/auth/AuthForm.tsx`.

## How to View Your Data (Database)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-9702333801-bf1fb**.
3. Go to **Build** > **Firestore Database**.
4. Collection `user_profiles`: Contains user details (Full Name, Email, UID).

## Git Commands

### How to Update GitHub (After changes)
Run these commands whenever you want to push your latest work:
```bash
git add .
git commit -m "Describe your changes here"
git push origin main
```

### First Time Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/mavxi/Auth.git
git branch -M main
git push -u origin main
```

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
