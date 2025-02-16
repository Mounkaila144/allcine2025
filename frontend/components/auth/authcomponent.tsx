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
import LoadingSpinner from "@/components/LoadingSpinner";

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
    const [requestPasswordReset, { isLoading: isRequestPasswordResetLoading }] = useRequestPasswordResetMutation();  // Add isLoading
    const [resendOTP, { isLoading: isResendOTPLoading }] = useResendOTPMutation(); // Add isLoading
    const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation(); // Add isLoading


    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;

            const response = await login({
                phone: fullPhoneNumber,
                password
            }).unwrap();


            if (!response || !response.token || !response.user) {
                throw new Error('Réponse invalide du serveur');
            }

            dispatch(
                setCredentials({
                    token: response.token,
                    user: response.user,
                })
            );

            localStorage.setItem("token", response.token);

            toast.success("Connexion réussie", {
                duration: 2000,
            });

            const redirectPath = response.user.role === 'admin' ? '/dashboard' : '/client';
            if (response.user.role) {
                router.replace(redirectPath);
            }


        } catch (error: any) {


            toast.error(error.data?.message || "Une erreur est survenue lors de la connexion");
            localStorage.removeItem("token");
        }
    };

    const handleRegister = async (e) => {
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
            router.push("/client/login");
        } catch (error) {
            toast.error(error.data?.message || "Code de vérification incorrect");
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
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
        } finally {
            setIsResendingOTP(false); // Reset isResendingOTP regardless of success or failure
        }
    };

    const handleRequestPasswordReset = async (e) => {
        e.preventDefault();
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phone}`;
            await requestPasswordReset({ phone: fullPhoneNumber }).unwrap();
            toast.success("Un code de réinitialisation a été envoyé sur votre WhatsApp");
            setShowResetForm(true);
        } catch (error) {
            toast.error(error.data?.message || "Erreur lors de la demande de réinitialisation");
        }
    };

    const handleResetPassword = async (e) => {
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
                                {isVerifyingOTP ? <LoadingSpinner /> : "Vérifier le code"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={handleResendOTP}
                                disabled={resendCooldown > 0 || isResendingOTP || isResendOTPLoading}
                            >
                                {resendCooldown > 0
                                    ? `Renvoyer le code (${resendCooldown}s)`
                                    : isResendingOTPLoading ? <LoadingSpinner />
                                        :  "Renvoyer le code"}
                                {!resendCooldown && !isResendingOTP && !isResendOTPLoading  &&<RotateCw className="w-4 h-4 ml-2" />}
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
                            <Button type="submit" className="w-full" disabled={isResetPasswordLoading}>
                                {isResetPasswordLoading ? <LoadingSpinner /> : "Changer le mot de passe"}
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
                            <Button type="submit" className="w-full" disabled={isRequestPasswordResetLoading}>
                                {isRequestPasswordResetLoading ? <LoadingSpinner /> :  "Réinitialiser le mot de passe"}
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
                                        {isLoginLoading ? <LoadingSpinner /> : "Se connecter"}
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
                                        {isRegisterLoading ?  <LoadingSpinner /> : "S'inscrire"}
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