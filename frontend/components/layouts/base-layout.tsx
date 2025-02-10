// components/layouts/base-layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeConfig } from '@/types/theme';

interface BaseLayoutProps {
    children: React.ReactNode;
    themeConfig: ThemeConfig;
    className?: string;
}

export function BaseLayout({ children, themeConfig, className }: BaseLayoutProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme={themeConfig.defaultTheme}
            enableSystem={themeConfig.enableSystem}
            disableTransitionOnChange
        >
            <div className={className}>
                {children}
            </div>
        </ThemeProvider>
    );
}