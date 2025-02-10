// app/client/layout.tsx
import { BaseLayout } from '@/components/layouts/base-layout';
import { clientThemeConfig } from '@/lib/theme-configs';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ClientLayout({
                                       children,
                                     }: {
  children: React.ReactNode;
}) {
  return (
      <BaseLayout
          themeConfig={clientThemeConfig}
          className="flex min-h-screen flex-col"
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </BaseLayout>
  );
}