// app/recommendations/page.tsx

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRecommendationsQuery } from "@/lib/redux/api/recommendationsApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentGrid from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ContentModal from "@/components/ContentModal";
import { Content } from "@/lib/redux/api/contentsApi";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";

export default function RecommendationsPage() {

    const router = useRouter();
    const { data: contents, isLoading, error } = useGetRecommendationsQuery();
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
console.log(user)
    const handleOpenModal = (content: Content) => {
        setSelectedContent(content);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContent(null);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6">
                        <div className="text-center text-red-600">
                            Erreur de chargement des recommandations
                            <div className="mt-4">
                                <Button variant="outline" onClick={() => router.push("/")}>
                                    Retour à l'accueil
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                    Recommandations personnalisées pour {user.nom} {user.prenom}
                </h1>
            </div>

            {contents?.length === 0 ? (
                <Card className="text-center p-8">
                    <CardTitle>Aucune recommandation disponible</CardTitle>
                    <CardContent className="pt-4">
                        <p className="text-muted-foreground">
                            Likez plus de contenus pour améliorer nos recommandations
                        </p>
                        <Button className="mt-4" onClick={() => router.push("/")}>
                            Explorer le catalogue
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <ContentGrid
                        sortedContents={contents || []}
                        onOpenModal={handleOpenModal}
                        showLikes={true}
                    />

                    <ContentModal
                        isModalOpen={isModalOpen}
                        onCloseModal={handleCloseModal}
                        selectedContent={selectedContent}
                    />
                </>
            )}
        </div>
    );
}