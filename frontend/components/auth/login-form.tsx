"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useLoginMutation } from "@/lib/redux/api/authApi";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import countryCodes from "@/lib/countryCodes"; // Fichier JSON des pays et indicatifs
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

export function LoginForm() {
  const [search, setSearch] = useState(""); // Recherche dans la liste des pays
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Niger",
    code: "+227",
  });
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useAuth(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fullPhoneNumber = `${selectedCountry.code}${phone}`;
      const response = await login({ phone: fullPhoneNumber, password }).unwrap();

      console.log("📱 Réponse de login:", response);

      dispatch(
          setCredentials({
            token: response.token,
            user: response.user,
          })
      );

      localStorage.setItem("token", response.token);
      console.log("✅ Connexion réussie");
      toast.success("Connexion réussie");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Erreur de connexion:", error);
      toast.error(error.data?.message || "Une erreur est survenue");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-sm md:max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
              Connexion
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Entrez votre numéro de téléphone et votre mot de passe
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sélection de l'indicatif téléphonique */}
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger className="flex items-center px-3 py-2 border rounded-lg w-28 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                    {selectedCountry.code}
                    <ChevronsUpDown className="w-4 h-4 ml-2" />
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                    <input
                        type="text"
                        placeholder="Rechercher un pays..."
                        className="w-full px-3 py-2 border rounded-lg mb-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {countryCodes
                          .filter((country) =>
                              country.name.toLowerCase().includes(search.toLowerCase())
                          )
                          .map((country) => (
                              <div
                                  key={country.code}
                                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                                  onClick={() => setSelectedCountry(country)}
                              >
                                {country.name} ({country.code})
                              </div>
                          ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Champ de numéro de téléphone */}
                <Input
                    type="tel"
                    placeholder="6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                />
              </div>

              {/* Bouton de connexion */}
              <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              Vous n'avez pas de compte ?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Inscrivez-vous
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
  );
}
