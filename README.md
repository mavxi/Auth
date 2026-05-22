
# AuthFlow - Studio Management System

This is a modern Next.js project featuring a secure authentication flow and a comprehensive dashboard for school management (Yoga, Dance, Martial Arts, etc.).

## Технологический стек (Tech Stack)

1. **Backend:** TypeScript, Firebase Authentication, Firestore
2. **Frontend:** React, Next.js (App Router), Tailwind CSS, ShadCN UI
3. **Icons:** Lucide-React
4. **Security:** Google reCAPTCHA v2

## Features

- **Email/Password & Google Auth**: Secure login via Firebase.
- **Student Management**: CRM to track students and contacts.
- **Subscription Tracker**: Manage sessions (8, 12, etc.), track usage, and mark attendance with one click.
- **Dashboard Analytics**: Visual cards showing active status.
- **Landing Page**: Professional intro for your business.

## CAPTCHA Setup Instructions

To make the reCAPTCHA work:
1. Register at [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).
2. Choose **reCAPTCHA v2 ("I'm not a robot" Checkbox)**.
3. Add these domains to the list:
   - `localhost`
   - `studio-9702333801-bf1fb.firebaseapp.com`
   - `studio-9702333801-bf1fb.web.app`
4. Copy your **Site Key**.
5. Open `src/components/auth/AuthForm.tsx` and replace `YOUR_RECAPTCHA_SITE_KEY_HERE` with your key.

## How to View Your Data (Database)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-9702333801-bf1fb**.
3. Go to **Build** > **Firestore Database**.
4. Collections:
   - `user_profiles`: Admin user data.
   - `students`: Your database of students.
   - `subscriptions`: Active and historical session logs.

## Git Commands

### Sync Your Computer (Get changes from GitHub)
```bash
git pull origin main
```

### Update GitHub (Push your changes)
```bash
git add .
git commit -m "Your description"
git push origin main
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
