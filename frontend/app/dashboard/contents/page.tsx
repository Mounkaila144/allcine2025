'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentForm from '@/components/ContentForm';
import {
    useGetContentsQuery,
    useCreateContentMutation,
    useUpdateContentMutation,
    useDeleteContentMutation,
    type Content as ContentType,
    type CreateContentDto
} from '@/lib/redux/api/contentsApi';

// Define interfaces
export interface Content extends ContentType {}
export interface ContentResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    contents: Content[];
}

const defaultFormData: CreateContentDto = {
    titre: '',
    type: 'film',
    saisons_possedees: 0,
    tmdb_id: null,
    genre: null,
    description: null,
    image_url: null,
    release_date: new Date().toISOString().split('T')[0],
    status: 'released',
    rating: null,
    language: 'fr',
    production_country: null
};

export default function ContentsPage() {
    // State management
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        startDate: '',
        endDate: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingContent, setEditingContent] = useState<Content | null>(null);
    const [contentFormData, setContentFormData] = useState<CreateContentDto>(defaultFormData);

    // Query filters
    const queryFilters = {
        ...(filters.search && filters.search.length >= 3 && { search: filters.search }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        page,
        limit: pageSize
    };

    // API Hooks
    const { data, isLoading } = useGetContentsQuery(queryFilters);
    const contents = data?.contents || [];
    const pagination = {
        totalItems: data?.totalItems || 0,
        totalPages: data?.totalPages || 0,
        currentPage: data?.currentPage || 1,
        pageSize
    };

    const [createContent] = useCreateContentMutation();
    const [updateContent] = useUpdateContentMutation();
    const [deleteContent] = useDeleteContentMutation();

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setContentFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleTypeChange = (value: string) =>
        setContentFormData(prev => ({
            ...prev,
            type: value as 'film' | 'serie' | 'manga',
            saisons_possedees: value === 'serie' ? 1 : 0
        }));

    const resetForm = () => {
        setContentFormData(defaultFormData);
        setEditingContent(null);
    };

    const resetFilters = () => {
        setFilters({ search: '', type: 'all', startDate: '', endDate: '' });
        setPage(1);
    };

    const handleEdit = (content: Content) => {
        setEditingContent(content);
        setContentFormData(content);
        setIsDialogOpen(true);
    };

    const handleDelete = async (content: Content) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return;
        try {
            await deleteContent(content.id).unwrap();
            toast.success('Contenu supprimé avec succès');
        } catch (error) {
            toast.error('Une erreur est survenue lors de la suppression');
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (formData: CreateContentDto) => {
        try {
            const mutation = editingContent
                ? updateContent({ id: editingContent.id, content: formData })
                : createContent(formData);
            await mutation.unwrap();
            toast.success(`Contenu ${editingContent ? 'mis à jour' : 'ajouté'} avec succès`);
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error('Une erreur est survenue');
            console.error('Error:', error);
        }
    };

    // Table columns configuration
    const columns = [
        {
            key: 'image_url',
            title: 'Image',
            render: (content: Content) => (
                content.image_url
                    ? <img src={content.image_url} alt={content.titre} className="w-16 h-16 object-cover rounded-lg" />
                    : <div className="w-16 h-16 rounded-lg bg-gray-200" />
            )
        },
        { key: 'titre', title: 'Titre' },
        { key: 'type', title: 'Type' },
        { key: 'genre', title: 'Genre' },
        {
            key: 'saisons_possedees',
            title: 'Saisons',
            render: (content: Content) => content.type === 'serie' ? content.saisons_possedees : '-'
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (content: Content) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-200/20 rounded-md"
                        onClick={(e) => { e.stopPropagation(); handleEdit(content); }}
                    >
                        <Pencil className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-200/20 rounded-md"
                        onClick={(e) => { e.stopPropagation(); handleDelete(content); }}
                    >
                        <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                </div>
            )
        }
    ];

    if (isLoading) return <div>Chargement...</div>;

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Contenus</h1>
                    <p className="text-blue-100/60">Gérez votre bibliothèque de contenus (Films, Séries, Mangas)</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md"
                            onClick={() => { resetForm(); setIsDialogOpen(true); }}
                        >
                            <Plus className="h-4 w-4 mr-2" />Ajouter
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-blue-950 border-blue-900/30">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                {editingContent ? 'Modifier le contenu' : 'Ajouter un contenu'}
                            </DialogTitle>
                        </DialogHeader>
                        <ContentForm
                            onSubmit={handleSubmit}
                            initialData={contentFormData}
                            onCancel={() => { setIsDialogOpen(false); resetForm(); }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters section */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Input
                            placeholder="Rechercher (min. 3 caractères)..."
                            value={filters.search}
                            onChange={(e) => {
                                setFilters(prev => ({ ...prev, search: e.target.value }));
                                setPage(1);
                            }}
                            className="pl-10 bg-blue-950/50 border-blue-900/30 text-white"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        {filters.search?.length > 0 && filters.search.length < 3 && (
                            <span className="text-xs text-blue-400 mt-1 absolute bottom-[-20px]">
                                Min. 3 caractères
                            </span>
                        )}
                    </div>
                    <Select
                        value={filters.type}
                        onValueChange={(value) => {
                            setFilters(prev => ({ ...prev, type: value }));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="bg-blue-950/50 border-blue-900/30 text-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-950 border-blue-900/30 text-white">
                            <SelectItem value="all">Tous types</SelectItem>
                            <SelectItem value="film">Film</SelectItem>
                            <SelectItem value="serie">Série</SelectItem>
                            <SelectItem value="manga">Manga</SelectItem>
                        </SelectContent>
                    </Select>
                    <div>
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => {
                                setFilters(prev => ({ ...prev, startDate: e.target.value }));
                                setPage(1);
                            }}
                            className="bg-blue-950/50 border-blue-900/30 text-white"
                            placeholder="Date début"
                        />
                    </div>
                    <div>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => {
                                setFilters(prev => ({ ...prev, endDate: e.target.value }));
                                setPage(1);
                            }}
                            className="bg-blue-950/50 border-blue-900/30 text-white"
                            placeholder="Date fin"
                        />
                    </div>
                </div>
                {(filters.search || filters.type !== 'all' || filters.startDate || filters.endDate) && (
                    <Button
                        variant="outline"
                        className="mt-2 border-blue-400 text-blue-400 hover:bg-blue-900/20"
                        onClick={resetFilters}
                    >
                        <X className="h-4 w-4 mr-2" />Réinitialiser
                    </Button>
                )}
            </div>

            {/* DataTable section */}
            <DataTable
                columns={columns}
                data={contents}
                pagination={pagination}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />
        </div>
    );
}