export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
    defaultTheme: ThemeMode;
    enableSystem: boolean;
}