import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { addItem } from "@/lib/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Film, Tv, Book } from "lucide-react";

const ContentModal = ({ isModalOpen, onCloseModal, selectedContent }) => {
    const dispatch = useDispatch();
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [mangaStart, setMangaStart] = useState(0);
    const [mangaEnd, setMangaEnd] = useState(0);

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeasons(prev =>
            prev.includes(seasonNumber)
                ? prev.filter(n => n !== seasonNumber)
                : [...prev, seasonNumber]
        );
    };

    const handleAddToCart = () => {
        if (!selectedContent) return;

        const baseItem = {
            id: selectedContent.id,
            type: 'content',
            titre: selectedContent.titre,
            prix: 0,
            quantite: 1,
        };

        if (selectedContent.type === "film") {
            dispatch(addItem({
                ...baseItem,
                prix: 200,
                contentDetails: {
                    type: 'film',
                }
            }));
            toast.success("Film ajouté au panier !");
        } else if (selectedContent.type === "serie") {
            if (selectedSeasons.length === 0) {
                toast.error("Veuillez sélectionner au moins une saison");
                return;
            }
            dispatch(addItem({
                ...baseItem,
                contentDetails: {
                    type: 'serie',
                    saisons: selectedSeasons.map(number => ({ number })),
                },
            }));
            toast.success("Série ajoutée au panier !");
        } else if (selectedContent.type === "manga") {
            if (mangaStart <= 0 || mangaEnd <= 0 || mangaEnd < mangaStart) {
                toast.error("Veuillez sélectionner une plage de volumes valide");
                return;
            }
            dispatch(addItem({
                ...baseItem,
                prix: 300,
                contentDetails: {
                    type: 'manga',
                    volumes: { start: mangaStart, end: mangaEnd }
                }
            }));
            toast.success("Manga ajouté au panier !");
        }

        onCloseModal();
    };

    if (!selectedContent) return null;

    return (
        <Dialog open={isModalOpen} onOpenChange={onCloseModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {selectedContent.type === "film" && <Film className="h-5 w-5" />}
                        {selectedContent.type === "serie" && <Tv className="h-5 w-5" />}
                        {selectedContent.type === "manga" && <Book className="h-5 w-5" />}
                        {selectedContent.titre}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    {/* Image */}
                    {selectedContent.image_url && (
                        <div className="relative w-full pt-[56.25%]">
                            <Image
                                src={selectedContent.image_url}
                                alt={selectedContent.titre}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, 600px"
                                priority
                            />
                        </div>
                    )}

                    {/* Informations générales */}
                    <div className="grid gap-2">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{selectedContent.genre}</span>
                            {selectedContent.release_date && (
                                <span>{new Date(selectedContent.release_date).getFullYear()}</span>
                            )}
                            {selectedContent.duration_minutes && (
                                <span>{selectedContent.duration_minutes} minutes</span>
                            )}
                            {selectedContent.average_rating && (
                                <span className="text-yellow-500">★ {selectedContent.average_rating.toFixed(1)}</span>
                            )}
                        </div>

                        {/* Description */}
                        {selectedContent.description && (
                            <DialogDescription className="text-foreground mt-2">
                                {selectedContent.description}
                            </DialogDescription>
                        )}
                    </div>

                    {/* Sélection des saisons pour les séries */}
                    {selectedContent.type === "serie" && (
                        <div className="space-y-4">
                            <DialogDescription>
                                Sélectionnez les saisons
                            </DialogDescription>
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: selectedContent.saisons_possedees }, (_, i) => i + 1).map((season) => (
                                    <div key={season} className="flex items-center gap-2">
                                        <Checkbox className=" border-white "
                                            checked={selectedSeasons.includes(season)}
                                            onCheckedChange={() => handleSeasonChange(season)}
                                        />
                                        <label>Saison {season}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sélection des volumes pour les mangas */}
                    {selectedContent.type === "manga" && (
                        <div className="space-y-4">
                            <DialogDescription>
                                Choisissez la plage de volumes
                            </DialogDescription>
                            <div className="flex gap-4 items-center">
                                <Input
                                    type="number"
                                    placeholder="Volume de début"
                                    value={mangaStart || ""}
                                    onChange={(e) => setMangaStart(Number(e.target.value))}
                                />
                                <span className="text-muted-foreground">à</span>
                                <Input
                                    type="number"
                                    placeholder="Volume de fin"
                                    value={mangaEnd || ""}
                                    onChange={(e) => setMangaEnd(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </DialogClose>
                    <Button onClick={handleAddToCart}>
                        Ajouter au panier
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ContentModal;