'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Shield, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  User
} from '@/lib/redux/api/userApi';

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'bg-purple-500/20', text: 'text-purple-500' },
  client: { bg: 'bg-blue-500/20', text: 'text-blue-500' }
};

export default function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    phone: '',
    role: 'client' as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      phone: '',
      role: 'client',
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser?.id) {
      toast.error('Une erreur est survenue');
      return;
    }

    try {
      await updateUser({
        id: editingUser.id,
        ...formData
      }).unwrap();

      toast.success('Utilisateur mis à jour avec succès');
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      phone: user.phone,
      role: user.role === 'admin' ? 'client' : user.role, // conversion ou vérification
    });

    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(user.id).unwrap();
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const columns = [
    {
      key: 'nom',
      title: 'Nom Complet',
      render: (user: User) => `${user.prenom} ${user.nom}`
    },
    { key: 'phone', title: 'Téléphone' },
    {
      key: 'role',
      title: 'Rôle',
      render: (user: User) => (
          <span className={`px-2 py-1 rounded-full text-xs ${roleColors[user.role].bg} ${roleColors[user.role].text}`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Client'}
                </span>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: (user: User) => (
          <span className={`px-2 py-1 rounded-full text-xs ${
              user.isConfirme
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-yellow-500/20 text-yellow-500'
          }`}>
                    {user.isConfirme ? 'Confirmé' : 'En attente'}
                </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (user: User) => (
          <div className="flex space-x-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(user);
                }}
            >
              <Pencil className="h-4 w-4 text-blue-400" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(user);
                }}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Utilisateurs</h1>
            <p className="text-blue-100/60">Gérez les utilisateurs et leurs permissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-effect border-blue-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Rôles Disponibles</h3>
                <p className="text-sm text-blue-100/60">2 niveaux daccès</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Administrateur</span>
                <span className="text-xs text-blue-100/60">Accès complet</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Client</span>
                <span className="text-xs text-blue-100/60">Accès standard</span>
              </div>
            </div>
          </div>

          <div className="glass-effect border-blue-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Utilisateurs Confirmés</h3>
                <p className="text-sm text-blue-100/60">
                  {users.filter(u => u.isConfirme).length} utilisateurs
                </p>
              </div>
            </div>
          </div>

          <div className="glass-effect border-blue-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Mail className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">En Attente de Confirmation</h3>
                <p className="text-sm text-blue-100/60">
                  {users.filter(u => !u.isConfirme).length} utilisateurs
                </p>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-effect border-blue-900/20">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">
                Modifier l Utilisateur
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Prénom</Label>
                <Input
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="Prénom de l'utilisateur"
                    className="bg-blue-950/50 border-blue-900/30 text-white"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Nom</Label>
                <Input
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Nom de l'utilisateur"
                    className="bg-blue-950/50 border-blue-900/30 text-white"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Téléphone</Label>
                <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Numéro de téléphone"
                    className="bg-blue-950/50 border-blue-900/30 text-white"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Rôle</Label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md"
                >
                  <option value="client">Client</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Mettre à jour
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DataTable
            columns={columns}
            data={users}
            onRowClick={(user) => {
              handleEdit(user);
            }}
        />
      </div>
  );
}