// app/categories/page.tsx
'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
  type CreateCategoryDto
} from '@/lib/redux/api/categoryApi';
import { Badge } from '@/components/ui/badge';
import { useGetArticlesQuery } from '@/lib/redux/api/articleApi';

const defaultFormData: CreateCategoryDto = {
  nom: ''
};

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<CreateCategoryDto>(defaultFormData);
  // app/categories/page.tsx (suite)

  const queryFilters = {
    ...(search && search.length >= 3 && { search }),
    page,
    limit: pageSize
  };

  const { data: { categories = [], pagination } = {}, isLoading: isLoadingCategories } = useGetCategoriesQuery(queryFilters);
  const { data: { articles = [] } = {} } = useGetArticlesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setCategoryFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setCategoryFormData(defaultFormData);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, category: categoryFormData }).unwrap();
        toast.success('Catégorie mise à jour avec succès');
      } else {
        await createCategory(categoryFormData).unwrap();
        toast.success('Catégorie créée avec succès');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error('Error:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      nom: category.nom
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    // Vérifier si la catégorie est utilisée par des articles
    const articlesInCategory = articles.filter(article => article.categorie_id === category.id);

    if (articlesInCategory.length > 0) {
      toast.error(`Impossible de supprimer la catégorie: ${articlesInCategory.length} article(s) y sont associés`);
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      await deleteCategory(category.id).unwrap();
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression');
      console.error('Error:', error);
    }
  };

  const columns = [
    { key: 'nom', title: 'Nom' },
    {
      key: 'articleCount',
      title: 'Articles',
      render: (category: Category) => {
        const count = articles.filter(article => article.categorie_id === category.id).length;
        return (
            <Badge variant={count > 0 ? 'default' : 'secondary'} className="font-mono">
              {count} <FileText className="h-3 w-3 ml-1 inline-block" />
            </Badge>
        );
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (category: Category) => (
          <div className="flex space-x-2">
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-200/20 rounded-md"
                onClick={(e) => { e.stopPropagation(); handleEdit(category); }}
            >
              <Pencil className="h-4 w-4 text-blue-400" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-200/20 rounded-md"
                onClick={(e) => { e.stopPropagation(); handleDelete(category); }}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
      )
    }
  ];

  if (isLoadingCategories) return <div>Chargement...</div>;

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Catégories</h1>
            <p className="text-blue-100/60">Gérez vos catégories de produits</p>
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
                  {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                      id="nom"
                      name="nom"
                      value={categoryFormData.nom}
                      onChange={handleInputChange}
                      required
                      className="bg-blue-950/50 border-blue-900/30 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    {editingCategory ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="relative w-full md:w-1/3">
            <Input
                placeholder="Rechercher (min. 3 caractères)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-blue-950/50 border-blue-900/30 text-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {search && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setSearch('')}
                >
                  <X className="h-4 w-4" />
                </Button>
            )}
          </div>
        </div>

        <DataTable
            columns={columns}
            data={categories}
            pagination={{
              totalItems: pagination?.totalItems || 0,
              totalPages: pagination?.totalPages || 0,
              currentPage: pagination?.currentPage || 1,
              pageSize: pageSize
            }}
            onPageChange={(page) => setPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
        />
      </div>
  );
}