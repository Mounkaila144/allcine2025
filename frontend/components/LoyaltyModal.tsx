import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, RotateCcw, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function LoyaltyModal({
                                         isOpen,
                                         onClose,
                                         user,
                                         currentStamps = 0,
                                         currentCards = 0,
                                         onUpdate
                                     }) {
    const [stamps, setStamps] = useState(currentStamps);

    useEffect(() => {
        setStamps(currentStamps);
    }, [currentStamps]);

    const handleAddStamp = async () => {
        try {
            const newStamps = stamps + 1;
            setStamps(newStamps);

            // Si atteint 10 points, notification de nouvelle carte
            if (newStamps % 10 === 0) {
                toast.success(`${user.prenom} a complété une nouvelle carte !`);
            }

            await onUpdate({
                stamp_count: newStamps,
                card_count: Math.floor(newStamps / 10)
            });

            toast.success('Point ajouté avec succès');
        } catch (error) {
            setStamps(stamps); // Restaurer l'ancienne valeur en cas d'erreur
            toast.error('Erreur lors de l\'ajout du point');
        }
    };

    const handleRemoveStamp = async () => {
        try {
            if (stamps > 0) {
                const newStamps = stamps - 1;
                setStamps(newStamps);
                await onUpdate({
                    stamp_count: newStamps,
                    card_count: Math.floor(newStamps / 10)
                });
                toast.success('Point retiré avec succès');
            }
        } catch (error) {
            setStamps(stamps); // Restaurer l'ancienne valeur en cas d'erreur
            toast.error('Erreur lors du retrait du point');
        }
    };

    const handleReset = async () => {
        try {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser les points de fidélité ?')) {
                await onUpdate({ stamp_count: 0, card_count: 0 });
                setStamps(0);
                toast.success('Points réinitialisés avec succès');
            }
        } catch (error) {
            setStamps(stamps); // Restaurer l'ancienne valeur en cas d'erreur
            toast.error('Erreur lors de la réinitialisation');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-effect border-blue-900/20">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Points de Fidélité - {user?.prenom} {user?.nom}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="text-center p-4 bg-blue-950/30 rounded-lg">
                        <div className="text-4xl font-bold text-white mb-2">{stamps}</div>
                        <div className="text-blue-100/60">Points actuels</div>
                        <div className="text-sm text-blue-100/60 mt-1">
                            {Math.floor(stamps / 10)} cartes complètes
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={handleRemoveStamp}
                            variant="outline"
                            className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                            disabled={stamps === 0}
                        >
                            <Minus className="h-4 w-4 text-red-400" />
                        </Button>
                        <Button
                            onClick={handleAddStamp}
                            variant="outline"
                            className="bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
                        >
                            <Plus className="h-4 w-4 text-green-400" />
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="bg-yellow-600/10 hover:bg-yellow-600/20 border-yellow-600/20"
                        >
                            <RotateCcw className="h-4 w-4 text-yellow-400 mr-2" />
                            Réinitialiser
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}