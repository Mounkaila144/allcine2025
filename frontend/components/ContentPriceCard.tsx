"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Film, Tv, BookOpen } from "lucide-react";
import { useDispatch } from 'react-redux';
import { addItem, setCartOpen } from '@/lib/redux/slices/cartSlice';
import { toast } from 'sonner';
import Image from "next/image";

const ContentPriceCard = ({ content }) => {
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState('1');

    const getPriceOptions = () => {
        switch (content.type) {
            case 'serie':
                return [
                    { value: '1', label: '1 saison', price: 500, seasons: 1 },
                    { value: '2', label: '2 saisons', price: 1000, seasons: 2 },
                    { value: '3', label: '3 saisons', price: 1500, seasons: 3 },
                    { value: '4', label: '4 saisons + 1 bonus', price: 2000, seasons: 5 },
                ];
            case 'film':
                return [
                    { value: '1', label: '1 film', price: 200, quantity: 1 },
                    { value: '3', label: '3 films', price: 500, quantity: 3 },
                ];
            case 'manga':
                return [
                    { value: '40', label: '40 épisodes', price: 500, episodes: 40 },
                ];
            default:
                return [];
        }
    };

    const getIcon = () => {
        switch (content.type) {
            case 'serie':
                return <Tv className="h-5 w-5 text-yellow-500" />;
            case 'film':
                return <Film className="h-5 w-5 text-yellow-500" />;
            case 'manga':
                return <BookOpen className="h-5 w-5 text-yellow-500" />;
            default:
                return null;
        }
    };

    const handleAddToCart = () => {
        const option = getPriceOptions().find(opt => opt.value === selectedOption);
        if (!option) return;

        let description = '';
        if (content.type === 'serie') {
            description = `${option.seasons} saison${option.seasons > 1 ? 's' : ''}`;
            if (option.seasons === 5) {
                description = '4 saisons + 1 bonus';
            }
        } else if (content.type === 'film') {
            description = `${option.quantity} film${option.quantity > 1 ? 's' : ''}`;
        } else if (content.type === 'manga') {
            description = '40 épisodes';
        }

        const cartItem = {
            id: content.id,
            type: 'content',
            titre: `${content.titre} (${description})`,
            prix: option.price,
            quantite: 1,
            image_url: content.image_url,
            // Métadonnées pour l'API
            contentDetails: {
                type: content.type,
                saisons_possedees: option.seasons,
                episodes_count: option.episodes,
                quantity: option.quantity
            }
        };

        dispatch(addItem(cartItem));
        dispatch(setCartOpen(true));
        toast.success('Contenu ajouté au panier');
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative pt-[75%]">
                {content.image_url ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL_BASE}${content.image_url}`}
                        alt={content.titre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        {getIcon()}
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    {getIcon()}
                    {content.titre}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Select value={selectedOption} onValueChange={setSelectedOption}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choisir une option" />
                        </SelectTrigger>
                        <SelectContent>
                            {getPriceOptions().map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {`${option.label} - ${option.price} FCFA`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Ajouter au panier
                        <ShoppingCart className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ContentPriceCard;