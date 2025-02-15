'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image, Search, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGetCategoriesQuery } from '@/lib/redux/api/categoryApi';
import {
    useGetArticlesQuery,
    useCreateArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    type Article,
    type ArticleFilters
} from '@/lib/redux/api/articleApi';

interface DialogState {
    isOpen: boolean;
    article: Article | null;
    formData: {
        titre: string;
        categorie_id: number;
        prix: number;
        description: string;
    };
    file: File | null;
    preview: string | null;
}

const ArticlesPage = () => {
    const [filters, setFilters] = useState<ArticleFilters>({
        search: '',
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: 'titre',
        sortOrder: 'asc',
        page: 1,
        limit: 10
    });

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [dialog, setDialog] = useState<DialogState>({
        isOpen: false,
        article: null,
        formData: { titre: '', categorie_id: 0, prix: 0, description: '' },
        file: null,
        preview: null
    });

    const { data: { articles = [], pagination } = {}, isLoading } = useGetArticlesQuery({
        ...filters,
        categoryId: selectedCategory !== 'all' ? Number(selectedCategory) : undefined
    });
    const { data: { categories = [] } = {} } = useGetCategoriesQuery({});
    const [createArticle] = useCreateArticleMutation();
    const [updateArticle] = useUpdateArticleMutation();
    const [deleteArticle] = useDeleteArticleMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(dialog.formData).forEach(([k, v]) => formData.append(k, v.toString()));
        if (dialog.file) formData.append('image', dialog.file);

        try {
            if (dialog.article?.id) {
                await updateArticle({ id: dialog.article.id, data: formData }).unwrap();
            } else {
                await createArticle(formData).unwrap();
            }
            setDialog({ isOpen: false, article: null, formData: { titre: '', categorie_id: 0, prix: 0, description: '' }, file: null, preview: null });
            toast.success(dialog.article ? 'Article mis à jour' : 'Article créé');
        } catch (error) {
            toast.error('Erreur');
        }
    };

    const columns = useMemo(() => [
        {
            key: 'image',
            title: 'Image',
            render: (article: Article) => (
                <div className="w-16 h-16">
                    {article.image ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL_BASE}${article.image}`} alt={article.titre} className="w-full h-full object-cover rounded" />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded">
                            <Image className="w-6 h-6 text-gray-500" />
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'titre',
            title: 'Titre',
            render: (article: Article) => article.titre
        },
        {
            key: 'category',
            title: 'Catégorie',
            render: (article: Article) => article.Category?.nom || 'Non catégorisé'
        },
        {
            key: 'prix',
            title: 'Prix',
            render: (article: Article) => `${Number(article.prix).toFixed(2)} €`
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (article: Article) => (
                <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => setDialog({
                        isOpen: true,
                        article,
                        formData: {
                            titre: article.titre,
                            categorie_id: article.categorie_id,
                            prix: article.prix,
                            description: article.description
                        },
                        file: null,
                        preview: article.image ? `${process.env.NEXT_PUBLIC_API_URL_BASE}${article.image}` : null
                    })}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => {
                        if (window.confirm('Confirmer la suppression ?')) {
                            deleteArticle(article.id)
                                .unwrap()
                                .then(() => toast.success('Article supprimé'))
                                .catch(() => toast.error('Erreur'));
                        }
                    }}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], []);

    if (isLoading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Articles</h1>
                <Dialog open={dialog.isOpen} onOpenChange={(open) => !open && setDialog({ isOpen: false, article: null, formData: { titre: '', categorie_id: 0, prix: 0, description: '' }, file: null, preview: null })}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setDialog({ ...dialog, isOpen: true })}>
                            <Plus className="mr-2" />Ajouter
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{dialog.article ? 'Modifier' : 'Ajouter'} un article</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* ... (rest of the form remains the same) ... */}
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        placeholder="Rechercher..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    />
                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                            setSelectedCategory(value);
                            setFilters({ ...filters, page: 1 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nom}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Prix min"
                        value={filters.minPrice || ''}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                    />
                    <Input
                        type="number"
                        placeholder="Prix max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                    />
                </div>
                {(filters.search || selectedCategory !== 'all' || filters.minPrice || filters.maxPrice) && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSelectedCategory('all');
                            setFilters({
                                search: '',
                                categoryId: undefined,
                                minPrice: undefined,
                                maxPrice: undefined,
                                sortBy: 'titre',
                                sortOrder: 'asc',
                                page: 1,
                                limit: 10
                            });
                        }}
                    >
                        <XCircle className="mr-2" />
                        Réinitialiser
                    </Button>
                )}
            </div>

            {pagination && (
                <DataTable
                    columns={columns}
                    data={articles}
                    pagination={{
                        totalItems: pagination.totalItems,
                        totalPages: pagination.totalPages,
                        currentPage: pagination.currentPage,
                        pageSize: pagination.limit
                    }}
                    onPageChange={(page: number) => setFilters({ ...filters, page })}
                    onPageSizeChange={(pageSize: number) => setFilters({ ...filters, limit: pageSize, page: 1 })}
                />
            )}
        </div>
    );
};

export default ArticlesPage;