
# AuthFlow - Studio Management System

This is a modern Next.js project featuring a secure authentication flow and a comprehensive dashboard for school management (Yoga, Dance, Martial Arts, etc.).

## Технологический стек (Tech Stack)

1. **Backend:** TypeScript, Firebase Authentication, Firestore
2. **Frontend:** React, Next.js (App Router), Tailwind CSS, ShadCN UI
3. **Icons:** Lucide-React

## Features

- **Email/Password & Google Auth**: Secure login via Firebase.
- **Student Management**: CRM to track students and contacts.
- **Subscription Tracker**: Manage sessions (8, 12, etc.), track usage, and mark attendance with one click.
- **Dashboard Analytics**: Visual cards showing active status.
- **Landing Page**: Professional intro for your business.

## CAPTCHA (Status: TEMPORARILY DISABLED)

The Google reCAPTCHA has been temporarily replaced with a placeholder to allow for testing without a Site Key. 
To enable it back later:
1. Register at [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).
2. Choose **reCAPTCHA v2 ("I'm not a robot" Checkbox)**.
3. Add your domains (`localhost`, etc.).
4. Re-install `react-google-recaptcha` and update `AuthForm.tsx`.

## How to View Your Data (Database)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-9702333801-bf1fb**.
3. Go to **Build** > **Firestore Database**.
4. Collections:
   - `user_profiles`: Admin user data.
   - `students`: Your database of students.
   - `subscriptions`: Active and historical session logs.

## Git Commands

### Update GitHub (Push your changes)
```bash
git add .
git commit -m "Your description"
git push origin main
```

### Sync Your Computer (Get changes from GitHub)
```bash
git pull origin main
```

## Setup Instructions

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Run**:
   ```bash
   npm run dev
   ```
