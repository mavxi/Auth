# **App Name**: AuthFlow

## Core Features:

- Email/Password Login: Enable users to log in using their email address and a securely hashed password stored via Firebase Authentication.
- Password Reset Workflow: Provide a mechanism for users to request and complete password resets through a guided process.
- Basic User Profile Management: Store and retrieve essential user data such as full name (ФИО) and email, linked to their authentication record in Firebase (using Firestore for profile details).
- VK Authentication Integration (Placeholder): Include UI elements and backend hooks to prepare for future integration of VK (ВКонтакте) social login, leveraging Firebase Authentication for external providers.

## Style Guidelines:

- Dark color scheme featuring deep charcoal greys for backgrounds, drawing directly from the provided CSS to evoke a secure and professional atmosphere.
- Primary interactive color: a vibrant cyan-blue (`#007EA5`), chosen from the provided stylesheet's active state for clear calls to action and emphasis.
- Background color: a desaturated, cool dark grey (`#34383D`), providing a stark contrast to text and interactive elements while maintaining visual depth, as seen in the provided CSS body style.
- Accent color: a rich, royal blue (`#144DE6`), used sparingly for additional highlights or to signify important information.
- Body and headline font: 'Open Sans' (sans-serif), as specified in the provided CSS, for its readability and modern appeal. Note: currently only Google Fonts are supported.
- Utilize 'FontAwesome' for consistent and visually clear icons, integrating with the chosen typography for form elements as indicated by the CSS font-family.
- A centrally aligned, minimalist login form with a fixed width (320px), following the structural properties provided by the reference CSS for focused user interaction.
- Subtle hover effects on interactive elements, such as color changes and text shadows, to provide visual feedback as observed in the provided stylesheet for the submit button.