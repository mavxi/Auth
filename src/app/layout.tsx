import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuthFlow - Secure Login',
  description: 'Secure authentication flow with Firebase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#34383D] min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
