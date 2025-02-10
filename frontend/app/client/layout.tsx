import './client.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/client/theme-provider";
import Navbar from '@/components/client/navbar';
import Footer from '@/components/client/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MediaStore - Films, Séries et Produits Tech',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}