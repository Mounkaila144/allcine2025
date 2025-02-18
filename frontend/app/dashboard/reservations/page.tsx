'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, TrendingUp, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Reservation {
  id: number;
  customer: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

const mockReservations: Reservation[] = [
  {
    id: 1,
    customer: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+33 6 12 34 56 78',
    date: '2024-03-27',
    time: '19:00',
    guests: 4,
    status: 'confirmed',
    notes: 'Table près de la fenêtre demandée'
  },
  {
    id: 2,
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+33 6 98 76 54 32',
    date: '2024-03-27',
    time: '20:30',
    guests: 2,
    status: 'pending'
  }
];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500' },
  confirmed: { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
  cancelled: { bg: 'bg-yellow-500/20', text: 'text-yellow-500' }
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesDate = !dateFilter || reservation.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (reservationId: number, newStatus: Reservation['status']) => {
    setReservations(reservations.map(reservation => 
      reservation.id === reservationId 
        ? { ...reservation, status: newStatus }
        : reservation
    ));
    toast.success('Statut de la réservation mis à jour');
  };

  const columns = [
    { key: 'id', title: 'N° Réservation' },
    { key: 'customer', title: 'Client' },
    { key: 'date', title: 'Date' },
    { key: 'time', title: 'Heure' },
    { key: 'guests', title: 'Couverts' },
    {
      key: 'status',
      title: 'Statut',
      render: (reservation: Reservation) => (
        <select
          value={reservation.status}
          onChange={(e) => handleStatusChange(reservation.id, e.target.value as Reservation['status'])}
          className={`px-2 py-1 rounded-full text-xs ${statusColors[reservation.status].bg} ${statusColors[reservation.status].text} bg-opacity-20`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="cancelled">Annulée</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Réservations</h1>
        <p className="text-blue-100/60">Gérez vos réservations clients</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Réservations du Jour"
          value={reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length.toString()}
          icon={Calendar}
          trend="+8.1%"
          description="vs. hier"
        />
        <StatCard
          title="Couverts Total"
          value={reservations.reduce((sum, r) => sum + r.guests, 0).toString()}
          icon={Users}
          trend="+12.5%"
          description="vs. hier"
        />
        <StatCard
          title="Taux d'Occupation"
          value="78%"
          icon={TrendingUp}
          trend="+5.2%"
          description="vs. hier"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-blue-950/50 border-blue-900/30 text-white"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-blue-950/50 border-blue-900/30 text-white rounded-md px-3 py-2"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-blue-950/50 border-blue-900/30 text-white"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredReservations}
        onRowClick={(reservation) => {
          setSelectedReservation(reservation);
          setIsDetailsOpen(true);
        }}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="glass-effect border-blue-900/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Détails de la Réservation #{selectedReservation?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Client</Label>
                  <p className="text-blue-100">{selectedReservation.customer}</p>
                </div>
                <div>
                  <Label className="text-white">Contact</Label>
                  <p className="text-blue-100">{selectedReservation.email}</p>
                  <p className="text-blue-100">{selectedReservation.phone}</p>
                </div>
                <div>
                  <Label className="text-white">Date et Heure</Label>
                  <p className="text-blue-100">
                    {new Date(selectedReservation.date).toLocaleDateString('fr-FR')} à {selectedReservation.time}
                  </p>
                </div>
                <div>
                  <Label className="text-white">Nombre de couverts</Label>
                  <p className="text-blue-100">{selectedReservation.guests} personnes</p>
                </div>
              </div>

              {selectedReservation.notes && (
                <div>
                  <Label className="text-white">Notes</Label>
                  <p className="text-blue-100">{selectedReservation.notes}</p>
                </div>
              )}

              <div>
                <Label className="text-white">Statut</Label>
                <select
                  value={selectedReservation.status}
                  onChange={(e) => handleStatusChange(selectedReservation.id, e.target.value as Reservation['status'])}
                  className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md mt-1"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}