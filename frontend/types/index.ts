// types/index.ts
export interface Article {
    id: number;
    titre: string;
    categorie_id: number;
    prix: number;
    description: string;
    image: string | null;
    Category?: {
        nom: string;
    };
}
export interface DeliveryInfo {
    address: string;
    note: string;
    isRequired?: boolean;
}
type ContentDetails = {
    type: 'serie' | 'film' | 'manga';
    saisons_possedees?: number[];  // Tableau des numéros de saisons
    // ... autres propriétés
};
export interface CartItem {
    type: 'article' | 'content';
    id: number;
    titre: string;
    prix: number;
    quantite: number;
    saisons_possedees?: number;
}

export interface DeliveryInfo {
    address: string;
    note: string;
}