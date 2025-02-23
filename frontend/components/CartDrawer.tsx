import { useDispatch, useSelector } from 'react-redux';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, ShoppingCart, Film, Tv, BookOpen, Package2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
    selectCartItems,
    selectIsCartOpen,
    selectDeliveryInfo,
    setCartOpen,
    removeItem,
    updateQuantity,
    updateDeliveryInfo,
    clearCart,
    toggleDeliveryRequired
} from '@/lib/redux/slices/cartSlice';
import { useCreateOrderMutation } from "@/lib/redux/api/ordersApi";

export const CartDrawer = () => {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const isOpen = useSelector(selectIsCartOpen);
    const deliveryInfo = useSelector(selectDeliveryInfo);
    const [createOrder] = useCreateOrderMutation();

    // Constants for discount and pricing - Meilleure pratique
    const SERIE_SEASON_PRICE = 500;
    const MANGA_EPISODES_PER_PRICE_UNIT = 40;
    const MANGA_PRICE_UNIT = 500;
    const MANGA_SEASON_PRICE = 500; // Prix par saison pour les mangas classés par saison
    const FILM_SET_PRICE = 500;
    const FILM_INDIVIDUAL_PRICE = 200; // Prix individuel d'un film avant réduction
    const DELIVERY_FEE = 1000;
    const FILMS_IN_SET = 3;
    const SERIES_SEASONS_FOR_FREE = 4;


    // Calcul du total (avec réductions) et détails des réductions
    const calculateTotal = () => {
        let totalAvantReductions = 0;
        let total = 0;
        let seriesSeasonCount = 0;
        let freeSeriesSeasonCount = 0;
        let seriesDiscount = 0;
        let filmDiscount = 0;
        let deliveryFee = 0;
        let filmCount = 0;

        let articleTotal = 0;
        let filmTotal = 0;
        let serieTotal = 0;
        let mangaTotal = 0;
        let currentFilmDiscount = 0;
        let currentSeriesDiscount = 0;


        items.forEach(item => {
            if (item.type === 'article') {
                const itemPrice = item.prix * item.quantite;
                totalAvantReductions += itemPrice;
                total += itemPrice;
                articleTotal += itemPrice;
            } else if (item.contentDetails) {
                if (item.contentDetails.type === 'film') {
                    const itemPrice = FILM_INDIVIDUAL_PRICE;
                    totalAvantReductions += itemPrice; // Prix individuel avant réduction
                    filmCount++;
                    total += itemPrice; // Sera ajusté plus tard pour la réduction 3 pour 500
                    filmTotal += FILM_INDIVIDUAL_PRICE;
                } else if (item.contentDetails.type === 'serie') {
                    const seasonPrice = SERIE_SEASON_PRICE;
                    seriesSeasonCount += item.contentDetails.saisons?.length || 0;
                    let serieItemTotal = 0;
                    item.contentDetails.saisons?.forEach(() => {
                        totalAvantReductions += seasonPrice;
                        total += seasonPrice;
                        serieItemTotal += seasonPrice;
                    });
                    serieTotal += serieItemTotal;
                } else if (item.contentDetails.type === 'manga') {
                    let mangaItemTotal = 0;
                    if (item.contentDetails.classification === 'season') {
                        // Manga classé par saison (prix par saison)
                        seriesSeasonCount += item.contentDetails.saisons?.length || 0; // Réutilise le compteur de saisons de séries pour l'offre "1 saison gratuite pour 4" si applicable aux mangas saisons
                        item.contentDetails.saisons?.forEach(() => {
                            const seasonPrice = MANGA_SEASON_PRICE;
                            totalAvantReductions += seasonPrice;
                            total += seasonPrice;
                            mangaItemTotal += seasonPrice;
                        });
                    } else {
                        // Manga classé par épisode (40 épisodes = 500f) - Default si classification non spécifiée
                        if (item.contentDetails.episodeStart && item.contentDetails.episodeEnd) {
                            const episodeCount = item.contentDetails.episodeEnd - item.contentDetails.episodeStart + 1;
                            const mangaPrice = Math.ceil(episodeCount / MANGA_EPISODES_PER_PRICE_UNIT) * MANGA_PRICE_UNIT;
                            totalAvantReductions += mangaPrice;
                            total += mangaPrice;
                            mangaItemTotal += mangaPrice;
                        }
                    }
                    mangaTotal += mangaItemTotal;
                }
            }
        });

        // Réduction pour les séries (et mangas classés par saison si vous souhaitez appliquer la même réduction)
        freeSeriesSeasonCount = Math.floor(seriesSeasonCount / SERIES_SEASONS_FOR_FREE);
        seriesDiscount = freeSeriesSeasonCount * SERIE_SEASON_PRICE; // Utilise SERIE_SEASON_PRICE car le prix par saison manga est le même
        currentSeriesDiscount = seriesDiscount; // Stocker la réduction actuelle pour les séries/mangas saisons
        total -= seriesDiscount;
        serieTotal -= seriesDiscount; // Apply discount to serie total as well
        mangaTotal -= seriesDiscount; // Apply discount to manga total as well


        // Réduction pour les films
        const filmDiscountSets = Math.floor(filmCount / FILMS_IN_SET);
        filmDiscount = filmDiscountSets * (FILMS_IN_SET * FILM_INDIVIDUAL_PRICE - FILM_SET_PRICE) ; // Calcul de la réduction totale
        currentFilmDiscount = filmDiscount; // Stocker la réduction actuelle pour les films
        total -= filmDiscount;
        filmTotal -= filmDiscount; // Apply discount to film total


        // Frais de livraison
        if (deliveryInfo.isRequired) {
            deliveryFee = DELIVERY_FEE;
            total += deliveryFee;
        }

        return {
            totalAvantReductions,
            total,
            seriesDiscount,
            filmDiscount,
            deliveryFee,
            articleTotal,
            filmTotal,
            serieTotal,
            mangaTotal,
            currentFilmDiscount, // Ajout de la réduction actuelle pour les films
            currentSeriesDiscount // Ajout de la réduction actuelle pour les series/mangas saisons
        };
    };

    const { total, totalAvantReductions, seriesDiscount, filmDiscount, deliveryFee, articleTotal, filmTotal, serieTotal, mangaTotal, currentFilmDiscount, currentSeriesDiscount } = calculateTotal();


    const handleQuantityChange = (id, type, change) => {
        if (type === 'article') {
            const item = items.find(item => item.id === id && item.type === type);
            if (item) {
                const newQuantity = Math.max(1, item.quantite + change);
                dispatch(updateQuantity({ id, type, quantite: newQuantity }));
            }
        }
    };

    const handleRemoveItem = (id, type) => {
        dispatch(removeItem({ id, type }));
        toast.success('Article retiré du panier');
    };

    const handleSubmitOrder = async () => {
        if (!items.length) {
            toast.error('Le panier est vide');
            return;
        }

        if (deliveryInfo.isRequired && !deliveryInfo.address) {
            toast.error('Veuillez renseigner l\'adresse de livraison');
            return;
        }

        try {
            const orderData = {
                data: {
                    total: deliveryInfo.isRequired ? total + DELIVERY_FEE : total,
                    articles: items
                        .filter(item => item.type === 'article')
                        .map(item => ({
                            id: item.id,
                            prix: item.prix,
                            titre: item.titre,
                            quantite: item.quantite
                        })),
                    contents: items
                        .filter(item => item.type === 'content')
                        .map(item => ({
                            id: item.id,
                            prix: item.prix,
                            type: item.contentDetails?.type || 'content',
                            titre: item.titre,
                            saisons: item.contentDetails?.saisons?.map((saison: any) => saison.number),
                            episode_start: item.contentDetails?.episodeStart,
                            episode_end: item.contentDetails?.episodeEnd,
                        })),
                    deliveryInfo: {
                        isRequired: deliveryInfo.isRequired,
                        address: deliveryInfo.address,
                        note: deliveryInfo.note
                    }
                }
            };

            await createOrder(orderData).unwrap();
            dispatch(clearCart());
            dispatch(setCartOpen(false));
            toast.success('Commande créée avec succès');
        } catch (error) {
            toast.error('Erreur lors de la création de la commande');
        }
    };
    const getContentDescription = (item) => {
        if (!item.contentDetails) return '';

        switch (item.contentDetails.type) {
            case 'serie':
                return item.contentDetails.saisons?.map((s: any) => `Saison ${s.number}`).join(', ') || '';
            case 'manga':
                if (item.contentDetails.classification === 'season') {
                    return item.contentDetails.saisons?.map((s: any) => `Saison ${s.number}`).join(', ') || '';
                } else {
                    return `Épisodes ${item.contentDetails.episodeStart} - ${item.contentDetails.episodeEnd}`;
                }
            case 'film':
            default:
                return '';
        }
    };

    const renderArticleItem = (item) => (
        <div
            key={`<span class="math-inline">\{item\.type\}\-</span>{item.id}`}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
        >
            <div className="flex-grow">
                <h3 className="font-medium">{item.titre}</h3>
                <p className="text-sm text-gray-400">
                    {Number(item.prix).toFixed(2)} FCFA × {item.quantite}
                </p>
            </div>
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.type, -1)}
                    >
                        <span className="text-lg">-</span>
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantite}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.type, 1)}
                    >
                        <span className="text-lg">+</span>
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id, item.type)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    const renderContentItem = (item) => (
        <div
            key={`<span class="math-inline">\{item\.type\}\-</span>{item.id}`}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
        >
            <div className="flex-grow">
                <h3 className="font-medium">{item.titre}</h3>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400">
                        {item.contentDetails?.type === 'film' ? `${FILM_INDIVIDUAL_PRICE.toFixed(2)} FCFA` :
                            item.contentDetails?.type === 'serie' ? `${SERIE_SEASON_PRICE.toFixed(2)} FCFA/Saison` :
                                item.contentDetails?.type === 'manga' && item.contentDetails?.classification === 'season' ? `${MANGA_SEASON_PRICE.toFixed(2)} FCFA/Saison` :
                                    item.contentDetails?.type === 'manga' ? `${MANGA_PRICE_UNIT.toFixed(2)} FCFA/${MANGA_EPISODES_PER_PRICE_UNIT} Épisodes` : ''}
                    </p>
                    <p className="text-xs text-gray-300">
                        {getContentDescription(item)}
                    </p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id, item.type)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );


    const renderSection = (title, items, icon, categoryTotal, discountAmount, isPhysicalItem = false) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h3 className="font-semibold text-lg">{title}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="font-semibold text-md text-green-400">
                            {categoryTotal.toFixed(2)} FCFA
                        </div>
                        {discountAmount > 0 && (
                            <div className="text-sm text-yellow-400 line-through">
                                { (categoryTotal + discountAmount).toFixed(2) } FCFA
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-3">
                    {items.map(item =>
                        isPhysicalItem ? renderArticleItem(item) : renderContentItem(item)
                    )}
                </div>
            </div>
        );
    };

    const groupedItems = {
        article: items.filter(item => item.type === 'article'),
        film: items.filter(item => item.type === 'content' && item.contentDetails?.type === 'film'),
        serie: items.filter(item => item.type === 'content' && item.contentDetails?.type === 'serie'),
        manga: items.filter(item => item.type === 'content' && item.contentDetails?.type === 'manga')
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
            <SheetContent className="flex flex-col h-screen w-full sm:w-[540px] bg-gray-800 text-white">
                <SheetHeader className="shrink-0">
                    <SheetTitle className="text-white flex items-center">
                        <ShoppingCart className="mr-2" />
                        Panier ({items.length} articles)
                    </SheetTitle>
                </SheetHeader>


                <div className="flex flex-col flex-grow overflow-y-auto">
                    <div className="flex-grow p-4">
                        {items.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">Votre panier est vide</p>
                        ) : (
                            <>
                                {renderSection("Articles", groupedItems.article, <Package2 className="h-5 w-5 text-blue-500" />, articleTotal, 0, true)}
                                {renderSection("Films", groupedItems.film, <Film className="h-5 w-5 text-yellow-500" />, filmTotal, currentFilmDiscount)}
                                {renderSection("Séries", groupedItems.serie, <Tv className="h-5 w-5 text-yellow-500" />, serieTotal, currentSeriesDiscount)}
                                {renderSection("Mangas", groupedItems.manga, <BookOpen className="h-5 w-5 text-yellow-500" />, mangaTotal, currentSeriesDiscount)}
                            </>
                        )}
                    </div>


                    <div className="mt-auto p-4 shrink-0 space-y-4 border-t border-gray-700">

                        <div className="flex items-center space-x-2 mb-2">
                            <Checkbox className=" border-white "
                                id="delivery-option"
                                checked={deliveryInfo.isRequired || false}
                                onCheckedChange={() => dispatch(toggleDeliveryRequired())}
                            />
                            <label
                                htmlFor="delivery-option"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Je souhaite une livraison
                            </label>
                        </div>

                        {deliveryInfo.isRequired && (
                            <div className="space-y-3">
                                <Input
                                    placeholder="Adresse de livraison"
                                    value={deliveryInfo.address}
                                    onChange={(e) =>
                                        dispatch(
                                            updateDeliveryInfo({
                                                ...deliveryInfo,
                                                address: e.target.value
                                            })
                                        )
                                    }
                                    className="bg-gray-700"
                                />
                                <Textarea
                                    placeholder="Note pour la livraison"
                                    value={deliveryInfo.note}
                                    onChange={(e) =>
                                        dispatch(
                                            updateDeliveryInfo({
                                                ...deliveryInfo,
                                                note: e.target.value
                                            })
                                        )
                                    }
                                    className="bg-gray-700"
                                />
                            </div>
                        )}

                        {/* Affichage des réductions et du total général (les réductions par catégorie sont affichées dans les sections) */}
                        {deliveryFee > 0 && (
                            <div className="flex justify-between items-center py-1 text-sm">
                                <span>Frais de Livraison</span>
                                <span className="text-blue-400">+ {deliveryFee.toFixed(2)} FCFA</span>
                            </div>
                        )}


                        <div className="flex justify-between items-center py-3 font-bold">
                            <span className="text-lg">Total Général</span>
                            <span className="text-lg text-green-400">{total.toFixed(2)} FCFA</span>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmitOrder}
                            disabled={items.length === 0}
                        >
                            Commander
                        </Button>
                    </div>
                </div>
            </SheetContent>        </Sheet>
    );
};