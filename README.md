
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
- **Modern UI**: Built with ShadCN UI, Tailwind CSS, and Lucide icons.

## How to View Your Data (Database)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-9702333801-bf1fb**.
3. Go to **Build** > **Firestore Database**.
4. Collection `user_profiles`: Contains user details (Full Name, Email, UID).

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
