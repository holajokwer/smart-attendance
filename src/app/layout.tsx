import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Smart Attendance System",
  description: "QR-based smart attendance management system for modern educational institutions. Powered by real-time QR codes.",
  keywords: "attendance, QR code, smart attendance, student management, teacher portal",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
