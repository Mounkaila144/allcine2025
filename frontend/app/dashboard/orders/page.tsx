'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, TrendingUp, DollarSign, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useGetOrdersQuery, useUpdateOrderStatusMutation, Order } from '@/lib/redux/api/ordersApi';
import LoadingSpinner from "@/components/LoadingSpinner";

const statusColors: Record<string, { bg: string; text: string; hoverBg: string }> = {
  en_attente: { bg: 'bg-yellow-600/20', text: 'text-yellow-500', hoverBg: 'hover:bg-yellow-600/30' },
  confirme: { bg: 'bg-blue-500/20', text: 'text-blue-500', hoverBg: 'hover:bg-blue-500/30' },
  livre: { bg: 'bg-green-500/20', text: 'text-green-500', hoverBg: 'hover:bg-green-500/30' },
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filteredOrders = useMemo(() => orders.filter(order =>
      order.id.toString().includes(searchTerm) &&
      (statusFilter === 'all' || order.statut === statusFilter) &&
      (!dateFilter || order.createdAt.split('T')[0] === dateFilter)
  ), [orders, searchTerm, statusFilter, dateFilter]);

  const handleStatusChange = async (orderId: number, newStatus: Order['statut']) => {
    try {
      const updatedOrder = await updateOrderStatus({ id: orderId, statut: newStatus }).unwrap();
      toast.success('Statut de la commande mis à jour');
      if (selectedOrder?.id === orderId) setSelectedOrder(updatedOrder);
    } catch {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const dailyOrders = useMemo(() => orders.filter(o =>
      new Date(o.createdAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
  ), [orders]);

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.data.total, 0), [orders]);

  const columns = useMemo(() => [
    { key: 'id', title: 'N° Commande', render: (order: Order) => <span className="text-gray-300">#{order.id.toString().padStart(6, '0')}</span> },
    {
      key: 'client', title: 'Client', render: (order: Order) => (
          <div className="flex flex-col">
            <span className="font-medium text-white">{order.User?.prenom ?? 'Utilisateur'} {order.User?.nom ?? 'inconnu'}</span>
            <span className="text-sm text-blue-400">{order.User?.phone ?? 'Pas de téléphone'}</span>
          </div>
      )
    },
    { key: 'date', title: 'Date', render: (order: Order) => <span className="text-gray-300">{formatDate(order.createdAt)}</span> },
    { key: 'total', title: 'Total', render: (order: Order) => <span className="text-green-400">{order.data.total.toFixed(2)} €</span> },
    {
      key: 'status', title: 'Statut', render: (order: Order) => (
          <select
              value={order.statut}
              onChange={(e) => handleStatusChange(order.id, e.target.value as Order['statut'])}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.statut].bg} ${statusColors[order.statut].text} ${statusColors[order.statut].hoverBg} transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              onClick={(e) => e.stopPropagation()}
          >
            <option value="en_attente" className="bg-gray-800 text-yellow-500">En attente</option>
            <option value="confirme" className="bg-gray-800 text-blue-500">Confirmée</option>
            <option value="livre" className="bg-gray-800 text-green-500">Livrée</option>
          </select>
      )
    }
  ], [handleStatusChange]);

  if (isLoading) return <LoadingSpinner />;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Commandes</h1>
          <p className="text-blue-400">Gérez vos commandes clients</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <StatCard title="Commandes du Jour" value={dailyOrders.length.toString()} icon={ShoppingBag} trend="+12.5%" description="vs. hier" />
          <StatCard title="Chiffre d'Affaires" value={`${totalRevenue.toFixed(2)} €`} icon={DollarSign} trend="+15.3%" description="vs. hier" />
          <StatCard title="Taux de Conversion" value="68%" icon={TrendingUp} trend="+4.1%" description="vs. hier" />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-colors duration-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="confirme">Confirmée</option>
              <option value="livre">Livrée</option>
            </select>
            <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-colors duration-200"
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
          <DataTable
              columns={columns}
              data={filteredOrders}
              onRowClick={(order) => { setSelectedOrder(order); setIsDetailsOpen(true); }}
          />
        </div>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">Détails de la Commande #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white mb-2 block">Client</Label>
                    <div className="text-blue-400 space-y-1">
                      {selectedOrder.User ? (<><p className="text-white">{selectedOrder.User.prenom} {selectedOrder.User.nom}</p><p>{selectedOrder.User.phone}</p></>) : (<p>Informations client non disponibles</p>)}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Articles</Label>
                    <div className="space-y-2">
                      {selectedOrder.data.articles?.map((item) => (
                          <div key={item.id} className="flex justify-between text-gray-300">
                            <span>{item.quantite}x {item.titre}</span>
                            <span className="text-green-400">{(item.prix * item.quantite).toFixed(2)} €</span>
                          </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.data.contents && selectedOrder.data.contents.length > 0 && (
                      <div>
                        <Label className="text-white mb-2 block">Contenus</Label>
                        <div className="space-y-2">
                          {selectedOrder.data.contents.map((content) => (
                              <div key={content.id} className="flex justify-between text-gray-300">
                                <span>{content.titre}{content.type === 'serie' && content.saisons_possedees && ` (${content.saisons_possedees} saisons)`}</span>
                                <span className="text-green-400">{content.prix.toFixed(2)} €</span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between font-bold text-white">
                      <span>Total</span>
                      <span className="text-green-400">{selectedOrder.data.total.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Statut</Label>
                    <select
                        value={selectedOrder.statut}
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['statut'])}
                        className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${statusColors[selectedOrder.statut].hoverBg}`}
                    >
                      <option value="en_attente" className="bg-gray-800 text-yellow-500">En attente</option>
                      <option value="confirme" className="bg-gray-800 text-blue-500">Confirmée</option>
                      <option value="livre" className="bg-gray-800 text-green-500">Livrée</option>
                    </select>
                  </div>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}