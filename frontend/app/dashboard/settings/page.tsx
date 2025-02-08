'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Link,
  Bell,
  Shield,
  CreditCard,
  Store,
  Mail,
  Phone
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const translations = {
  fr: {
    title: 'Paramètres',
    subtitle: 'Gérez les préférences de votre application',
    general: {
      title: 'Général',
      darkMode: 'Mode Sombre',
      darkModeDesc: 'Basculer entre thème clair/sombre',
      language: 'Langue',
      notifications: 'Notifications',
      notificationsDesc: 'Activer les notifications push',
      smsNotifications: 'Notifications SMS',
      emailNotifications: 'Notifications Email'
    },
    security: {
      title: 'Sécurité',
      twoFactor: 'Authentification à deux facteurs',
      twoFactorDesc: 'Ajouter une couche de sécurité supplémentaire',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe'
    },
    payment: {
      title: 'Paiements',
      defaultMethod: 'Méthode de paiement par défaut',
      enableNita: 'Activer Nita',
      nitaDesc: 'Accepter les paiements via Nita',
      nitaId: 'ID Marchand Nita',
      nitaKey: 'Clé API Nita',
      enableMobileMoney: 'Activer Mobile Money',
      mobileMoneyDesc: 'Accepter les paiements via Mobile Money'
    },
    store: {
      title: 'Boutique',
      storeName: 'Nom de la boutique',
      storeDesc: 'Description de la boutique',
      currency: 'Devise',
      businessHours: 'Heures d\'ouverture',
      contactEmail: 'Email de contact',
      contactPhone: 'Téléphone de contact',
      address: 'Adresse'
    },
    save: 'Enregistrer les modifications',
    cancel: 'Annuler'
  }
};

type Language = 'fr';
type Currency = 'XOF' | 'NGN' | 'USD';
type PaymentMethod = 'nita' | 'mobile-money' | 'cash';

interface SettingProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const SettingItem: React.FC<SettingProps> = ({ label, description, children }) => (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <Label className="text-base">{label}</Label>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language] = useState<Language>('fr');
  const t = translations[language];

  // State for general settings
  const [notifications, setNotifications] = useState({
    push: true,
    sms: true,
    email: true
  });

  // State for security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // State for payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultMethod: 'nita' as PaymentMethod,
    nitaEnabled: true,
    nitaId: '',
    nitaKey: '',
    mobileMoneyEnabled: true
  });

  // State for store settings
  const [storeSettings, setStoreSettings] = useState({
    name: '',
    description: '',
    currency: 'XOF' as Currency,
    businessHours: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const handleSaveSettings = async () => {
    try {
      // Implement your save logic here
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    }
  };

  return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <CardTitle>{t.general.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingItem label={t.general.darkMode} description={t.general.darkModeDesc}>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                  <Moon className="h-4 w-4" />
                </div>
              </SettingItem>

              <SettingItem label={t.general.notifications}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t.general.smsNotifications}</Label>
                    <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{t.general.emailNotifications}</Label>
                    <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                </div>
              </SettingItem>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle>{t.security.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingItem label={t.security.twoFactor} description={t.security.twoFactorDesc}>
                <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                />
              </SettingItem>

              <div className="space-y-4">
                <h3 className="font-medium">{t.security.changePassword}</h3>
                <div className="space-y-4">
                  <Input
                      type="password"
                      placeholder={t.security.currentPassword}
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                  />
                  <Input
                      type="password"
                      placeholder={t.security.newPassword}
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                  />
                  <Input
                      type="password"
                      placeholder={t.security.confirmPassword}
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>{t.payment.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select
                  value={paymentSettings.defaultMethod}
                  onValueChange={(value: PaymentMethod) =>
                      setPaymentSettings(prev => ({ ...prev, defaultMethod: value }))
                  }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.payment.defaultMethod} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nita">Nita</SelectItem>
                  <SelectItem value="mobile-money">Mobile Money</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>

              <SettingItem label={t.payment.enableNita} description={t.payment.nitaDesc}>
                <Switch
                    checked={paymentSettings.nitaEnabled}
                    onCheckedChange={(checked) =>
                        setPaymentSettings(prev => ({ ...prev, nitaEnabled: checked }))
                    }
                />
              </SettingItem>

              {paymentSettings.nitaEnabled && (
                  <div className="space-y-4">
                    <Input
                        placeholder={t.payment.nitaId}
                        value={paymentSettings.nitaId}
                        onChange={(e) =>
                            setPaymentSettings(prev => ({ ...prev, nitaId: e.target.value }))
                        }
                    />
                    <Input
                        type="password"
                        placeholder={t.payment.nitaKey}
                        value={paymentSettings.nitaKey}
                        onChange={(e) =>
                            setPaymentSettings(prev => ({ ...prev, nitaKey: e.target.value }))
                        }
                    />
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Store Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <CardTitle>{t.store.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                  placeholder={t.store.storeName}
                  value={storeSettings.name}
                  onChange={(e) =>
                      setStoreSettings(prev => ({ ...prev, name: e.target.value }))
                  }
              />

              <Textarea
                  placeholder={t.store.storeDesc}
                  value={storeSettings.description}
                  onChange={(e) =>
                      setStoreSettings(prev => ({ ...prev, description: e.target.value }))
                  }
              />

              <Select
                  value={storeSettings.currency}
                  onValueChange={(value: Currency) =>
                      setStoreSettings(prev => ({ ...prev, currency: value }))
                  }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.store.currency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                  <SelectItem value="NGN">NGN (Naira)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                </SelectContent>
              </Select>

              <Input
                  placeholder={t.store.businessHours}
                  value={storeSettings.businessHours}
                  onChange={(e) =>
                      setStoreSettings(prev => ({ ...prev, businessHours: e.target.value }))
                  }
              />

              <Input
                  type="email"
                  placeholder={t.store.contactEmail}
                  value={storeSettings.contactEmail}
                  onChange={(e) =>
                      setStoreSettings(prev => ({ ...prev, contactEmail: e.target.value }))
                  }
              />

              <Input
                  type="tel"
                  placeholder={t.store.contactPhone}
                  value={storeSettings.contactPhone}
                  onChange={(e) =>
                      setStoreSettings(prev => ({ ...prev, contactPhone: e.target.value }))
                  }
              />

              <Textarea
                  placeholder={t.store.address}
                  value={storeSettings.address}
                  onChange={(e) =>
                      setStoreSettings(prev => ({ ...prev, address: e.target.value }))
                  }
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">{t.cancel}</Button>
          <Button onClick={handleSaveSettings}>{t.save}</Button>
        </div>
      </div>
  );
}