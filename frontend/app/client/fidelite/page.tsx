'use client';

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gift, Award, HardDrive, Check } from "lucide-react"
import { useGetLoyaltyStatusQuery } from '@/lib/redux/api/loyaltyApi'
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Fidelite() {
  const { data: loyalty, isLoading } = useGetLoyaltyStatusQuery();
  const maxPoints = 10 // Points nécessaires pour remplir une carte

  const rewards = [
    {
      level: 1,
      cards: 1,
      points: maxPoints,
      reward: "8 Go de films offerts",
      icon: HardDrive,
      progress: loyalty ? (loyalty.stamp_count >= maxPoints ? 100 : (loyalty.stamp_count / maxPoints) * 100) : 0
    },
    {
      level: 2,
      cards: 2,
      points: maxPoints * 2,
      reward: "16 Go de films offerts",
      icon: HardDrive,
      progress: loyalty ? (loyalty.stamp_count >= maxPoints * 2 ? 100 : (loyalty.stamp_count / (maxPoints * 2)) * 100) : 0
    },
    {
      level: 3,
      cards: 3,
      points: maxPoints * 3,
      reward: "32 Go de films offerts",
      icon: HardDrive,
      progress: loyalty ? (loyalty.stamp_count >= maxPoints * 3 ? 100 : (loyalty.stamp_count / (maxPoints * 3)) * 100) : 0
    }
  ]

  if (isLoading) return <LoadingSpinner />;

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Carte de Fidélité</h1>
          <Gift className="h-8 w-8 text-yellow-500" />
        </div>

        {/* Points actuels */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Vos points de fidélité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">{loyalty?.stamp_count || 0}</p>
              <p className="text-muted-foreground">points accumulés</p>
              <p className="text-sm text-muted-foreground mt-2">
                {loyalty?.card_count || 0} carte{loyalty?.card_count !== 1 ? 's' : ''} complète{loyalty?.card_count !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Niveaux de récompense */}
        <h2 className="text-2xl font-semibold mb-6">Niveaux de récompense</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward) => (
              <Card key={reward.level} className="relative overflow-hidden">
                {reward.progress === 100 && (
                    <div className="absolute top-2 right-2 bg-yellow-600 text-yellow-500-foreground px-2 py-1 rounded text-sm">
                      Débloqué !
                    </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <reward.icon className="h-6 w-6 text-yellow-500" />
                    Niveau {reward.level}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">{reward.reward}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Nécessite {reward.cards} carte{reward.cards > 1 ? "s" : ""} complète{reward.cards > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Progress value={reward.progress} />
                      <p className="text-sm text-muted-foreground text-right">
                        {loyalty?.stamp_count || 0}/{reward.points} points
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Comment ça marche */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Recevez 1 point pour chaque achat de 1000 FCFA ou plus</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Une carte complète = 10 points</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Plus vous cumulez de cartes, plus les récompenses sont importantes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Les points n'expirent jamais</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}