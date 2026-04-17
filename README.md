# AuthFlow - Secure Authentication with Firebase

This is a modern Next.js project featuring a secure authentication flow integrated with Firebase (Authentication and Firestore).

## Features

- **Email/Password Authentication**: Login, Sign-up, and Password Reset.
- **Google Authentication**: Seamless sign-in using Google accounts.
- **Reactive User Profiles**: User data is synchronized and stored in Firestore.
- **Modern UI**: Built with ShadCN UI, Tailwind CSS, and Lucide icons.
- **GenAI Ready**: Integrated with Genkit for future AI features.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mavxi/Auth.git
   cd Auth
   ```

2. **Enable Google Auth in Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Select your project.
   - Navigate to **Authentication** > **Sign-in method**.
   - Enable **Google** and provide a support email.

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Git Update Commands

To update your GitHub repository with the latest changes, run these commands in your terminal:

```bash
git add .
git commit -m "Integrate Google Auth and Firebase Firestore profiles"
git push origin main
```
