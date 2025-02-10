// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';
import { DebugAuth } from "@/components/auth/DebugAuth";
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Allciné - Films, Séries et Produits Tech',
  description: 'Votre destination pour les films, séries et produits informatiques',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
      <Providers>
        {children}
        <Toaster />
        <DebugAuth />
      </Providers>
      </body>
      </html>
  );
}