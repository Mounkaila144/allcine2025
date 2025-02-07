'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, Star, Film, Tv, BookOpen, Monitor, BarChart } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    loyaltyStamps: 0,
    contentAdded: 0,
    articleReads: 0,
    totalFilms: 0,
    totalSeries: 0,
    totalMangas: 0,
    totalTechProducts: 0,
    userActivity: [],
  });

  useEffect(() => {
    // Simulation des statistiques (remplace ça par un appel API)
    setTimeout(() => {
      setStats({
        users: 1250,
        orders: 780,
        loyaltyStamps: 340,
        contentAdded: 120,
        articleReads: 890,
        totalFilms: 300,
        totalSeries: 150,
        totalMangas: 500,
        totalTechProducts: 200,
        userActivity: [
          { date: 'Jan', activity: 200 },
          { date: 'Feb', activity: 250 },
          { date: 'Mar', activity: 220 },
          { date: 'Apr', activity: 290 },
          { date: 'May', activity: 310 },
          { date: 'Jun', activity: 370 },
        ],
      });
    }, 1000);
  }, []);

  const cards = [
    { title: 'Utilisateurs inscrits', value: stats.users, icon: Users },
    { title: 'Commandes réalisées', value: stats.orders, icon: ShoppingBag },
    { title: 'Cachets fidélité attribués', value: stats.loyaltyStamps, icon: Star },
    { title: 'Films ajoutés', value: stats.totalFilms, icon: Film },
    { title: 'Séries ajoutées', value: stats.totalSeries, icon: Tv },
    { title: 'Mangas ajoutés', value: stats.totalMangas, icon: BookOpen },
    { title: 'Produits informatiques ajoutés', value: stats.totalTechProducts, icon: Monitor },
    { title: 'Articles lus et interactions', value: stats.articleReads, icon: BookOpen },
  ];

  return (
      <ProtectedRoute>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vue d’ensemble des statistiques</h1>
            <p className="text-blue-100/60">Aperçu des principales activités et interactions des utilisateurs.</p>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
                <Card key={index} className="glass-effect border-blue-900/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-blue-100/80">{card.title}</CardTitle>
                    <card.icon className="h-6 w-6 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">{card.value}</div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {/* Graphique d'activité des utilisateurs */}
          <Card className="glass-effect border-blue-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-blue-400" />
                Activité des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
  );
}
