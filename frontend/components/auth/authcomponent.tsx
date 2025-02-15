"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {LogIn, UserPlus, Phone, Lock, ChevronsUpDown, RotateCw} from "lucide-react";
import { useLoginMutation, useRegisterMutation, useVerifyOTPMutation,useRequestPasswordResetMutation, useResendOTPMutation ,useResetPasswordMutation } from "@/lib/redux/api/authApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PhoneInputWithCountry from "@/components/auth/PhoneInputWithCountry";

export default function AuthComponent() {
    const [search, setSearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState({
        name: "Niger",
        code: "+227",
    });
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [isResendingOTP, setIsResendingOTP] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [newPassword, setNewPassword] = useState("");
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetOTP, setResetOTP] = useState("");


    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
    const [requestPasswordReset] = useRequestPasswordResetMutation();
    const [resendOTP] = useResendOTPMutation();
    const [resetPassword] = useResetPasswordMutation();


    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche la soumission native du formulaire

        // Log pour déboguer
        console.log('Début de la tentative de connexion');

        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            console.log('Tentative de connexion avec:', { phone: fullPhoneNumber });

            const response = await login({
                phone: fullPhoneNumber,
                password
            }).unwrap();

            // Log de la réponse
            console.log('Réponse de connexion:', response);

            if (!response || !response.token || !response.user) {
                console.error('Réponse invalide:', response);
                throw new Error('Réponse invalide du serveur');
            }

            // Dispatch synchrone
            dispatch(
                setCredentials({
                    token: response.token,
                    user: response.user,
                })
            );

            // Stockage synchrone
            localStorage.setItem("token", response.token);

            // Toast avec promesse
            toast.success("Connexion réussie", {
                duration: 2000,
            });

            // Attendre que tout soit bien mis à jour
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirection basée sur le rôle
            const redirectPath = response.user.role === 'admin' ? '/dashboard' : '/client';
if (response.user.role){
    router.replace(redirectPath);
}


        } catch (error: any) {
            // Log détaillé de l'erreur
            console.error("Erreur complète:", error);
            console.error("Message d'erreur:", error.data?.message);
            console.error("Stack trace:", error.stack);

            toast.error(error.data?.message || "Une erreur est survenue lors de la connexion");
            localStorage.removeItem("token");
        }
    };    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            const response = await register({
                phone: fullPhoneNumber,
                password,
                nom,
                prenom,
            }).unwrap();

            toast.success(response.message || "Un code de vérification a été envoyé sur WhatsApp");
            setShowOtpVerification(true);
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            toast.error(error.data?.message || "Une erreur est survenue");

        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            await verifyOTP({
                phone: fullPhoneNumber,
                otp: otpCode
            }).unwrap();

            toast.success("Compte vérifié avec succès!");
            setShowOtpVerification(false);
            // Rediriger vers la page de connexion
            router.push("/client/login");
        } catch (error) {
            console.error("Erreur de vérification:", error);
            toast.error(error.data?.message || "Code de vérification incorrect");
        }
    };
    const startResendCooldown = () => {
        setResendCooldown(60); // 60 secondes de cooldown
        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;

        setIsResendingOTP(true);
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            await resendOTP({ phone: fullPhoneNumber }).unwrap();
            toast.success("Un nouveau code de vérification a été envoyé");
            startResendCooldown();
        } catch (error) {
            toast.error(error.data?.message || "Erreur lors du renvoi du code");
        }
        setIsResendingOTP(false);
    };
    const handleRequestPasswordReset = async (e) => {
        e.preventDefault();
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            await requestPasswordReset({ phone: fullPhoneNumber }).unwrap();
            toast.success("Un code de réinitialisation a été envoyé sur votre WhatsApp");
            setShowResetForm(true); // Modifié ici
        } catch (error) {
            toast.error(error.data?.message || "Erreur lors de la demande de réinitialisation");
        }
    };    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            await resetPassword({
                phone: fullPhoneNumber,
                otp: resetOTP,
                newPassword
            }).unwrap();

            toast.success("Mot de passe réinitialisé avec succès");
            setShowPasswordReset(false);
            setShowResetForm(false);
        } catch (error) {
            toast.error(error.data?.message || "Erreur lors de la réinitialisation");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Bienvenue</CardTitle>
                    <CardDescription>
                        {showPasswordReset
                            ? "Réinitialisation du mot de passe"
                            : "Connectez-vous ou créez un compte pour accéder à nos services"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {showOtpVerification ? (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Code de vérification</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Entrez le code reçu sur WhatsApp"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isVerifyingOTP}>
                                {isVerifyingOTP ? "Vérification..." : "Vérifier le code"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={handleResendOTP}
                                disabled={resendCooldown > 0 || isResendingOTP}
                            >
                                {resendCooldown > 0
                                    ? `Renvoyer le code (${resendCooldown}s)`
                                    : isResendingOTP
                                        ? "Envoi en cours..."
                                        : "Renvoyer le code"}
                                {!resendCooldown && !isResendingOTP && <RotateCw className="w-4 h-4 ml-2" />}
                            </Button>
                        </form>
                    ) : showPasswordReset && showResetForm ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reset-otp">Code de vérification</Label>
                                <Input
                                    id="reset-otp"
                                    type="text"
                                    placeholder="Entrez le code reçu sur WhatsApp"
                                    value={resetOTP}
                                    onChange={(e) => setResetOTP(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                Changer le mot de passe
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => setShowPasswordReset(false)}
                            >
                                Retour à la connexion
                            </Button>
                        </form>
                    ) : showPasswordReset ? (
                        <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone-reset">Numéro WhatsApp</Label>
                                <PhoneInputWithCountry
                                    id="phone-reset"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Réinitialiser le mot de passe
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => setShowPasswordReset(false)}
                            >
                                Retour à la connexion
                            </Button>
                        </form>
                    ) : (
                        <Tabs defaultValue="connexion" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="connexion" className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Connexion
                                </TabsTrigger>
                                <TabsTrigger value="inscription" className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Inscription
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="connexion">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone-login">Numéro WhatsApp</Label>
                                        <PhoneInputWithCountry
                                            id="phone-login"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required={true}
                                            selectedCountry={selectedCountry}
                                            setSelectedCountry={setSelectedCountry}
                                            search={search}
                                            setSearch={setSearch}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-login">Mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="password-login"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoginLoading}>
                                        {isLoginLoading ? "Connexion..." : "Se connecter"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="w-full mt-2"
                                        onClick={() => setShowPasswordReset(true)}
                                    >
                                        Mot de passe oublié ?
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="inscription">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone-register">Numéro WhatsApp</Label>
                                        <PhoneInputWithCountry
                                            id="phone-register"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required={true}
                                            selectedCountry={selectedCountry}
                                            setSelectedCountry={setSelectedCountry}
                                            search={search}
                                            setSearch={setSearch}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-register">Mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="password-register"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom</Label>
                                        <Input
                                            id="nom"
                                            value={nom}
                                            onChange={(e) => setNom(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prenom">Prénom</Label>
                                        <Input
                                            id="prenom"
                                            value={prenom}
                                            onChange={(e) => setPrenom(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isRegisterLoading}>
                                        {isRegisterLoading ? "Inscription..." : "S'inscrire"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
