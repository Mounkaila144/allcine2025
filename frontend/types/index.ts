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
export interface CartItem {
    id: number;
    type: 'article' | 'content';
    titre: string;
    prix: number;
    quantite: number;
    contentDetails?: ContentDetails;
}

export interface ContentDetails {
    type: 'film' | 'serie' | 'manga';
    saisons_possedees?: number;
    episodes_count?: number;
    quantity?: number;
    saisons?: { number: number }[]; // <-- Correction de la syntaxe
    episodeStart?: number;
    episodeEnd?: number;
}

export interface DeliveryInfo {
    address: string;
    note: string;
}