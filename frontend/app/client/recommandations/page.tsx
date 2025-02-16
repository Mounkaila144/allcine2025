"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, Tv, ThumbsUp, Star, TrendingUp } from "lucide-react"
import Image from "next/image"

const recommendations = {
  films: [
    {
      id: 1,
      title: "Inception",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Science-fiction",
      rating: 4.8,
      reason: "Basé sur vos films préférés"
    },
    {
      id: 2,
      title: "The Dark Knight",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Action",
      rating: 4.9,
      reason: "Les plus populaires"
    }
  ],
  series: [
    {
      id: 3,
      title: "Breaking Bad",
      image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Drame",
      rating: 4.9,
      reason: "Recommandé pour vous"
    },
    {
      id: 4,
      title: "Stranger Things",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Science-fiction",
      rating: 4.7,
      reason: "Tendances actuelles"
    }
  ],
  trending: [
    {
      id: 5,
      title: "The Mandalorian",
      image: "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Science-fiction",
      rating: 4.8,
      reason: "Nouveau"
    },
    {
      id: 6,
      title: "Dune",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Science-fiction",
      rating: 4.7,
      reason: "Populaire cette semaine"
    }
  ]
}

export default function Recommandations() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Recommandations</h1>

      <Tabs defaultValue="films" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="films" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            Films
          </TabsTrigger>
          <TabsTrigger value="series" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            Séries
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="films">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.films.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="series">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.series.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.trending.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RecommendationCard({ item }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">{item.genre}</span>
          <span className="flex items-center gap-1 text-sm bg-primary/10 text-red-500 px-2 py-1 rounded">
            <Star className="h-4 w-4" />
            {item.rating}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          {item.reason}
        </div>
      </CardContent>
    </Card>
  )
}