'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image, Search, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
    type CreateArticleDto,
} from '@/lib/redux/api/articleApi';
import LoadingSpinner from "@/components/LoadingSpinner";

const defaultFormData: CreateArticleDto = {
    titre: '',
    categorie_id: 0,
    prix: 0,
    description: ''
};

export default function ArticlesPage() {
    // États du formulaire et du dialogue
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [articleFormData, setArticleFormData] = useState<CreateArticleDto>(defaultFormData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // États des filtres
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string>('all');
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [sortBy, setSortBy] = useState<string>('titre');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const queryFilters = {
        ...(search && { search }),
        ...(categoryId !== 'all' && { categoryId }),
        ...(minPrice !== undefined && { minPrice }),
        ...(maxPrice !== undefined && { maxPrice }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        page: currentPage,
        limit: pageSize
    };

    // Hooks d'API
    const { data, isLoading: isLoadingArticles } = useGetArticlesQuery(queryFilters);
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({});
    const [createArticle] = useCreateArticleMutation();
    const [updateArticle] = useUpdateArticleMutation();
    const [deleteArticle] = useDeleteArticleMutation();

    const articles = data?.articles || [];
    const pagination = data?.pagination;
    const categories = categoriesData?.categories || [];

    // Gestionnaires d'événements
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const processedValue = type === 'number' ? parseFloat(value) : value;
        setArticleFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setArticleFormData(defaultFormData);
        setEditingArticle(null);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            Object.entries(articleFormData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            if (editingArticle) {
                await updateArticle({ id: editingArticle.id, data: formData }).unwrap();
                toast.success('Article mis à jour avec succès');
            } else {
                await createArticle(formData).unwrap();
                toast.success('Article ajouté avec succès');
            }

            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error('Une erreur est survenue');
            console.error('Error:', error);
        }
    };

    const handleEdit = (article: Article) => {
        setEditingArticle(article);
        setArticleFormData({
            titre: article.titre,
            categorie_id: article.categorie_id,
            prix: article.prix,
            description: article.description
        });
        if (article.image) {
            setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL_BASE}${article.image}`);
        }
        setIsDialogOpen(true);
    };

    const handleDelete = async (article: Article) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
        try {
            await deleteArticle(article.id).unwrap();
            toast.success('Article supprimé avec succès');
        } catch (error) {
            toast.error('Une erreur est survenue lors de la suppression');
            console.error('Error:', error);
        }
    };

    const toggleSort = (field: string) => {
        setSortBy(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const columns = useMemo(() => [
        {
            key: 'image',
            title: 'Image',
            render: (article: Article) => (
                <div className="w-16 h-16">
                    {article.image ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL_BASE}${article.image}`}
                            alt={article.titre}
                            className="w-full h-full object-cover rounded"
                        />
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
            title: (
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort('titre')}>
                    Titre
                    {sortBy === 'titre' && (
                        sortOrder === 'asc' ?
                            <ChevronUp className="ml-1 h-4 w-4" /> :
                            <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                </div>
            ),
            render: (article: Article) => <span className="text-white">{article.titre}</span>
        },
        {
            key: 'category',
            title: 'Catégorie',
            render: (article: Article) => (
                <span className="text-gray-300">{article.Category?.nom || 'Non catégorisé'}</span>
            )
        },
        {
            key: 'prix',
            title: (
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort('prix')}>
                    Prix
                    {sortBy === 'prix' && (
                        sortOrder === 'asc' ?
                            <ChevronUp className="ml-1 h-4 w-4" /> :
                            <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                </div>
            ),
            render: (article: Article) => (
                <span className="text-green-400">{Number(article.prix).toFixed(2)} €</span>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (article: Article) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-700 rounded-md text-blue-400 hover:text-blue-300"
                        onClick={() => handleEdit(article)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-700 rounded-md text-red-500 hover:text-red-400"
                        onClick={() => handleDelete(article)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], [sortBy, sortOrder]);


    if (isLoadingArticles || isLoadingCategories) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Articles</h1>
                    <p className="text-blue-400">Gérez vos articles</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => { resetForm(); setIsDialogOpen(true); }}
                        >
                            <Plus className="h-4 w-4 mr-2" />Ajouter
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                {editingArticle ? 'Modifier l\'article' : 'Ajouter un article'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="titre" className="text-white">Titre</Label>
                                <Input
                                    id="titre"
                                    name="titre"
                                    value={articleFormData.titre}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="categorie_id" className="text-white">Catégorie</Label>
                                <Select
                                    value={articleFormData.categorie_id.toString()}
                                    onValueChange={(value) => setArticleFormData(prev => ({
                                        ...prev,
                                        categorie_id: parseInt(value, 10)
                                    }))}
                                >
                                    <SelectTrigger className="bg-gray-700 text-white">
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700">
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                                className="hover:bg-gray-600"
                                            >
                                                {category.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="prix" className="text-white">Prix</Label>
                                <Input
                                    id="prix"
                                    name="prix"
                                    type="number"
                                    step="0.01"
                                    value={articleFormData.prix}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="text-white">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={articleFormData.description}
                                    onChange={handleInputChange}
                                    className="bg-gray-700 text-white"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <Label htmlFor="image" className="text-white">Image</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="text-white"
                                />
                                {previewUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-40 max-h-40 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setIsDialogOpen(false); resetForm(); }}
                                    className="bg-gray-700 text-white"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {editingArticle ? 'Mettre à jour' : 'Ajouter'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 space-y-4">
                <h2 className="text-lg font-semibold text-white">Filtres</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="search" className="text-white block mb-1">Recherche</Label>
                        <div className="relative">
                            <Input
                                id="search"
                                type="text"
                                placeholder="Rechercher par titre..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-700 border border-gray-600 text-white pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="category" className="text-white block mb-1">Catégorie</Label>
                        <Select
                            value={categoryId}
                            onValueChange={(value) => {
                                setCategoryId(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="bg-gray-700 border border-gray-600 text-white w-full">
                                <SelectValue placeholder="Toutes les catégories" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700">
                                <SelectItem value="all" className="hover:bg-gray-600">
                                    Toutes les catégories
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                        className="hover:bg-gray-600"
                                    >
                                        {category.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="minPrice" className="text-white block mb-1">Prix Minimum</Label>
                        <Input
                            id="minPrice"
                            type="number"
                            step="0.01"
                            placeholder="Min"
                            value={minPrice ?? ''}
                            onChange={(e) => {
                                setMinPrice(e.target.value === '' ? undefined : Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-gray-700 border border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="maxPrice" className="text-white block mb-1">Prix Maximum</Label>
                        <Input
                            id="maxPrice"
                            type="number"
                            step="0.01"
                            placeholder="Max"
                            value={maxPrice ?? ''}
                            onChange={(e) => {
                                setMaxPrice(e.target.value === '' ? undefined : Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-gray-700 border border-gray-600 text-white"
                        />
                    </div>
                </div>
                {(search || categoryId !== 'all' || minPrice !== undefined || maxPrice !== undefined) && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearch('');
                            setCategoryId('all');
                            setMinPrice(undefined);
                            setMaxPrice(undefined);
                            setCurrentPage(1);
                            setSortBy('titre');
                            setSortOrder('asc');
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white mt-4"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Réinitialiser les filtres
                    </Button>
                )}
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                {pagination && (
                    <DataTable
                        columns={columns}
                        data={articles}
                        pagination={{
                            totalItems: pagination.totalItems,
                            totalPages: pagination.totalPages,
                            currentPage: pagination.currentPage,
                            limit: pagination.limit,
                            hasNextPage: pagination.currentPage < pagination.totalPages,
                            hasPreviousPage: pagination.currentPage > 1
                        }}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )}
            </div>
        </div>
    );
}