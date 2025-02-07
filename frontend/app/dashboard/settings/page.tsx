'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Moon,
  Bell,
  Globe,
  Building,
  Users,
  Link
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  // Hydration
  useEffect(() => {
    setMounted(true);
    // Charger les préférences sauvegardées
    const savedLanguage = localStorage.getItem('language') || 'en';
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setLanguage(savedLanguage);
    setTheme(savedTheme);
    setNotifications(localStorage.getItem('notifications') !== 'false');
  }, [setTheme]);

  // Gérer le changement de thème
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast.success(checked ? 'Mode sombre activé' : 'Mode clair activé');
  };

  // Gérer le changement de langue
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    toast.success('Langue mise à jour');
  };

  // Gérer le changement des notifications
  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications', checked.toString());
    toast.success(checked ? 'Notifications activées' : 'Notifications désactivées');
  };

  if (!mounted) {
    return null;
  }

  const translations = {
    en: {
      title: 'Settings',
      subtitle: 'Manage your application preferences',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Toggle dark/light theme',
      notifications: 'Notifications',
      notificationsDesc: 'Enable push notifications',
      language: 'Language',
      save: 'Save Changes',
      tenantSettings: 'Tenant Settings',
      restaurantName: 'Restaurant Name',
      contactEmail: 'Contact Email',
      businessHours: 'Business Hours',
      userManagement: 'User Management',
      manageUsers: 'Manage Users',
      manageRoles: 'Manage Roles',
      accessControl: 'Access Control',
      integrations: 'Integrations',
      paymentGateway: 'Payment Gateway',
      emailService: 'Email Service',
      configureIntegrations: 'Configure Integrations'
    },
    fr: {
      title: 'Paramètres',
      subtitle: 'Gérez les préférences de votre application',
      darkMode: 'Mode Sombre',
      darkModeDesc: 'Basculer entre thème clair/sombre',
      notifications: 'Notifications',
      notificationsDesc: 'Activer les notifications push',
      language: 'Langue',
      save: 'Enregistrer les modifications',
      tenantSettings: 'Paramètres du Restaurant',
      restaurantName: 'Nom du Restaurant',
      contactEmail: 'Email de Contact',
      businessHours: 'Heures d\'Ouverture',
      userManagement: 'Gestion des Utilisateurs',
      manageUsers: 'Gérer les Utilisateurs',
      manageRoles: 'Gérer les Rôles',
      accessControl: 'Contrôle d\'Accès',
      integrations: 'Intégrations',
      paymentGateway: 'Passerelle de Paiement',
      emailService: 'Service Email',
      configureIntegrations: 'Configurer les Intégrations'
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-blue-100/60">{t.subtitle}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="glass-effect border-blue-900/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg text-white">{t.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">{t.darkMode}</Label>
                <p className="text-sm text-blue-100/60">{t.darkModeDesc}</p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={handleThemeChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">{t.notifications}</Label>
                <p className="text-sm text-blue-100/60">{t.notificationsDesc}</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">{t.language}</Label>
              <select 
                className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-900/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg text-white">{t.tenantSettings}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">{t.restaurantName}</Label>
              <Input
                placeholder="Enter restaurant name"
                className="bg-blue-950/50 border-blue-900/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">{t.contactEmail}</Label>
              <Input
                type="email"
                placeholder="contact@restaurant.com"
                className="bg-blue-950/50 border-blue-900/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">{t.businessHours}</Label>
              <Input
                placeholder="Mon-Sun: 9:00 AM - 10:00 PM"
                className="bg-blue-950/50 border-blue-900/30 text-white"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {t.save}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-900/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg text-white">{t.userManagement}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {t.manageUsers}
            </Button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {t.manageRoles}
            </Button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {t.accessControl}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-900/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg text-white">{t.integrations}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">{t.paymentGateway}</Label>
              <select className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md">
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">{t.emailService}</Label>
              <select className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md">
                <option value="sendgrid">SendGrid</option>
                <option value="mailchimp">Mailchimp</option>
              </select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {t.configureIntegrations}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}