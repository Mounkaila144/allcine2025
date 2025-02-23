import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetLikesCountQuery, useToggleLikeMutation } from "@/lib/redux/api/likesApi";
import { toast } from "sonner";
import { addItem } from "@/lib/redux/slices/cartSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Book, Film, HeartIcon, Tv } from "lucide-react"; // On garde HeartIcon de lucide-react
import { Button } from "@/components/ui/button";

const ContentCard = ({ item, onOpenModal }) => {
    const dispatch = useDispatch();
    const [toggleLike] = useToggleLikeMutation();
    const { data: likesData } = useGetLikesCountQuery(item.id.toString());
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        if (likesData) {
            setLikesCount(likesData.likes_count);
            setIsLiked(likesData.is_liked);
        }
    }, [likesData]);

    const handleLike = async () => {
        try {
            await toggleLike({ content_id: item.id }).unwrap();
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du like");
        }
    };

    const handleAddToCartFilm = () => {
        dispatch(
            addItem({
                id: item.id,
                type: 'content',
                titre: item.titre,
                prix: 200,
                quantite: 1,
                contentDetails: {
                    type: 'film',
                }
            })
        );
        toast.success("Film ajouté au panier !");
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col w-full mx-auto">
            <div className="relative w-full pt-[100%]">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.titre}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        Pas d'image
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                    {item.type === "film" && <Film className="h-4 w-4" />}
                    {item.type === "serie" && <Tv className="h-4 w-4" />}
                    {item.type === "manga" && <Book className="h-4 w-4" />}
                    {item.titre}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">
                        {item.genre} {item.release_date && `(${new Date(item.release_date).getFullYear()})`}
                    </span>
                    {item.average_rating && (
                        <span className="text-xs bg-yellow-600/10 text-yellow-500 px-2 py-1 rounded">
                            ★ {item.average_rating.toFixed(1)}
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenModal(item)}
                    >
                        Voir plus
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLike} className="p-0 m-0">
                        {isLiked ? (
                            <HeartIcon className="text-red-500" fill="currentColor" strokeWidth={0.2} />
                        ) : (
                            <HeartIcon  />
                        )}
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};

export default ContentCard;