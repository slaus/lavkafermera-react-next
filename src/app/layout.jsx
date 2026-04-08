"use client";
import { Inter } from "next/font/google";
import "./globals.css";
// import { RecoilRoot } from 'recoil';
import { AppProviders } from '@/context/AppContext';

const inter = Inter({ subsets: ["cyrillic"] });

export default function RootLayout({ children }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
