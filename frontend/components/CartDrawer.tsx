// components/CartDrawer.tsx
import { useDispatch, useSelector } from 'react-redux';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import {
    selectCartItems,
    selectCartTotal,
    selectIsCartOpen,
    selectDeliveryInfo,
    setCartOpen,
    removeItem,
    updateQuantity,
    updateDeliveryInfo,
    clearCart
} from '@/lib/redux/slices/cartSlice';
import { useCreateOrderMutation } from "@/lib/redux/api/ordersApi";


export const CartDrawer = () => {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const isOpen = useSelector(selectIsCartOpen);
    const deliveryInfo = useSelector(selectDeliveryInfo);
    const [createOrder] = useCreateOrderMutation();

    const handleQuantityChange = (id: number, type: string, change: number) => {
        const item = items.find(item => item.id === id && item.type === type);
        if (item) {
            const newQuantity = Math.max(1, item.quantite + change);
            dispatch(updateQuantity({ id, type, quantite: newQuantity }));
        }
    };

    const handleRemoveItem = (id: number, type: string) => {
        dispatch(removeItem({ id, type }));
        toast.success('Article retiré du panier');
    };

    const handleSubmitOrder = async () => {
        if (!items.length) {
            toast.error('Le panier est vide');
            return;
        }

        if (!deliveryInfo.address) {
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
                            type: 'serie',
                            titre: item.titre,
                            saisons_possedees: item.saisons_possedees
                        })),
                    deliveryInfo
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

                    {/* Liste des articles */}
                    <div className="flex-grow">
                        {items.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">Votre panier est vide</p>
                        ) : (
                            <div className="space-y-4 px-4 py-2">
                                {items.map((item) => (
                                    <div
                                        key={`${item.type}-${item.id}`}
                                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                                    >
                                        <div className="flex-grow">
                                            <h3 className="font-medium">{item.titre}</h3>
                                            <p className="text-sm text-gray-400">
                                                {Number(item.prix).toFixed(2)} €
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.type, -1)
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm">{item.quantite}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.type, 1)
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
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
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section inférieure (informations de livraison et bouton) */}
                    <div className="mt-auto p-4 shrink-0">
                        <div className="space-y-4">
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

                            <div className="flex justify-between items-center py-4 border-t border-gray-700">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">{total.toFixed(2)} €</span>
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
                </div>
            </SheetContent>
        </Sheet>
    );
};