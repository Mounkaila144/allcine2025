// lib/theme-configs.ts
import { ThemeConfig } from '@/types/theme';

export const dashboardThemeConfig: ThemeConfig = {
    defaultTheme: 'dark',
    enableSystem: false,
};

export const clientThemeConfig: ThemeConfig = {
    defaultTheme: 'system',
    enableSystem: true,
};