// components/CartDrawer.tsx
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
    selectCartTotal,
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
    const total = useSelector(selectCartTotal);
    const isOpen = useSelector(selectIsCartOpen);
    const deliveryInfo = useSelector(selectDeliveryInfo);
    const [createOrder] = useCreateOrderMutation();

    // Grouper les articles par type
    const groupedItems = {
        article: items.filter(item => item.type === 'article'),
        film: items.filter(item => item.type === 'content' && item.contentDetails?.type === 'film'),
        serie: items.filter(item => item.type === 'content' && item.contentDetails?.type === 'serie'),
        manga: items.filter(item => item.type === 'content' && item.contentDetails?.type === 'manga')
    };

    // Calculer les totaux par catégorie
    const categoryTotals = {
        article: groupedItems.article.reduce((sum, item) => sum + (item.prix * item.quantite), 0),
        film: groupedItems.film.reduce((sum, item) => sum + item.prix, 0),
        serie: groupedItems.serie.reduce((sum, item) => sum + item.prix, 0),
        manga: groupedItems.manga.reduce((sum, item) => sum + item.prix, 0)
    };

    const handleQuantityChange = (id, type, change) => {
        // N'applique la modification de quantité que pour les articles physiques
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
                    total,
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
                            saisons_possedees: item.contentDetails?.saisons_possedees,
                            episodes_count: item.contentDetails?.episodes_count,
                            quantity: item.contentDetails?.quantity
                        })),
                    deliveryInfo: deliveryInfo.isRequired ? deliveryInfo : null
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

    // Fonction pour générer le texte descriptif pour chaque type de contenu
    const getContentDescription = (item) => {
        if (!item.contentDetails) return '';

        switch (item.contentDetails.type) {

        }
    };

    // Rendu pour les articles physiques (avec contrôle de quantité)
    const renderArticleItem = (item) => (
        <div
            key={`${item.type}-${item.id}`}
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

    // Rendu pour le contenu digital (sans contrôle de quantité)
    const renderContentItem = (item) => (
        <div
            key={`${item.type}-${item.id}`}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
        >
            <div className="flex-grow">
                <h3 className="font-medium">{item.titre}</h3>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400">
                        {Number(item.prix).toFixed(2)} FCFA
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

    // Fonction pour rendre une section de type de contenu
    const renderSection = (title, items, icon, categoryTotal, isPhysicalItem = false) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h3 className="font-semibold text-lg">{title}</h3>
                    </div>
                    <div className="text-yellow-400 font-medium">
                        {categoryTotal.toFixed(2)} FCFA
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

    return (
        <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
            <SheetContent className="flex flex-col h-screen w-[400px] sm:w-[540px] bg-gray-800 text-white">
                <SheetHeader className="shrink-0">
                    <SheetTitle className="text-white flex items-center">
                        <ShoppingCart className="mr-2" />
                        Panier ({items.length} articles)
                    </SheetTitle>
                </SheetHeader>

                {/* Conteneur principal avec flexbox et défilement */}
                <div className="flex flex-col flex-grow overflow-y-auto">

                    {/* Liste des articles par section */}
                    <div className="flex-grow p-4">
                        {items.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">Votre panier est vide</p>
                        ) : (
                            <>
                                {renderSection("Articles", groupedItems.article, <Package2 className="h-5 w-5 text-blue-500" />, categoryTotals.article, true)}
                                {renderSection("Films", groupedItems.film, <Film className="h-5 w-5 text-yellow-500" />, categoryTotals.film)}
                                {renderSection("Séries", groupedItems.serie, <Tv className="h-5 w-5 text-yellow-500" />, categoryTotals.serie)}
                                {renderSection("Mangas", groupedItems.manga, <BookOpen className="h-5 w-5 text-yellow-500" />, categoryTotals.manga)}
                            </>
                        )}
                    </div>

                    {/* Section inférieure (informations de livraison et bouton) */}
                    <div className="mt-auto p-4 shrink-0 space-y-4 border-t border-gray-700">
                        {/* Option de livraison */}
                        <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
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

                        {/* Champs de livraison conditionnels */}
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
            </SheetContent>
        </Sheet>
    );
};