// app/dashboard/page.tsx

'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, Star, Film, Tv, BookOpen, Monitor, BarChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import {useGetDashboardStatsQuery} from "@/lib/redux/api/dashboardApi";

interface StatCard {
    title: string;
    value?: number;
    icon: React.ComponentType;
    isLoading: boolean;
}

export default function DashboardPage() {
    // Utiliser skip: false pour forcer le rechargement
    const {
        data: stats,
        isLoading,
        error,
        refetch
    } = useGetDashboardStatsQuery(undefined, {
        // Rafraîchir toutes les 30 secondes
        pollingInterval: 30000,
        // Rafraîchir quand la fenêtre récupère le focus
        refetchOnFocus: true,
        // Rafraîchir quand on revient en ligne
        refetchOnReconnect: true,
    });

    // Effet pour recharger les données quand le composant est monté
    useEffect(() => {
        refetch();
    }, [refetch]);

    // Gestion des erreurs
    useEffect(() => {
        if (error) {
            console.error('Erreur lors du chargement des données:', error);
            // Vous pouvez ajouter ici une notification d'erreur si vous le souhaitez
        }
    }, [error]);

    const cards: StatCard[] = [
        { title: 'Utilisateurs inscrits', value: stats?.users, icon: Users, isLoading },
        { title: 'Commandes réalisées', value: stats?.orders, icon: ShoppingBag, isLoading },
        { title: 'Cachets fidélité attribués', value: stats?.loyaltyStamps, icon: Star, isLoading },
        { title: 'Films ajoutés', value: stats?.totalFilms, icon: Film, isLoading },
        { title: 'Séries ajoutées', value: stats?.totalSeries, icon: Tv, isLoading },
        { title: 'Mangas ajoutés', value: stats?.totalMangas, icon: BookOpen, isLoading },
        { title: 'Produits informatiques ajoutés', value: stats?.totalTechProducts, icon: Monitor, isLoading },
        { title: 'Articles lus et interactions', value: stats?.articleReads, icon: BookOpen, isLoading },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Vue d'ensemble des statistiques</h1>
                <p className="text-blue-100/60">
                    Aperçu des principales activités et interactions des utilisateurs
                    {isLoading && " (Chargement...)"}
                </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <Card key={index} className="border-blue-900/20"
                          style={{
                              backgroundColor: 'rgba(17, 25, 40, 0.75)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                          }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100/80">
                                {card.title}
                            </CardTitle>
                            {card.isLoading ? (
                                <Skeleton className="h-6 w-6" />
                            ) : (
                                <card.icon className="h-6 w-6 text-blue-400" />
                            )}
                        </CardHeader>
                        <CardContent>
                            {card.isLoading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <div className="text-2xl font-bold text-white mb-2">
                                    {card.value?.toLocaleString()}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Graphique d'activité */}
            <Card className="border-blue-900/20"
                  style={{
                      backgroundColor: 'rgba(17, 25, 40, 0.75)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                  }}
            >
                <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center">
                        <BarChart className="h-5 w-5 mr-2 text-blue-400" />
                        Activité des utilisateurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="w-full h-80" />
                    ) : stats?.userActivity ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.userActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" stroke="#ccc" />
                                <YAxis stroke="#ccc" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="activity"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}