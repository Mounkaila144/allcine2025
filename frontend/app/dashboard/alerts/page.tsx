'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { Bell, Send } from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  recipients: string;
  status: string;
  date: string;
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    title: 'New Menu Items',
    message: 'Check out our new summer menu items!',
    type: 'Notification',
    recipients: 'All Customers',
    status: 'Sent',
    date: '2024-03-27'
  },
  {
    id: 2,
    title: 'Special Discount',
    message: '20% off on all orders this weekend!',
    type: 'Email',
    recipients: 'Premium Members',
    status: 'Scheduled',
    date: '2024-03-28'
  }
];

const columns = [
  { key: 'title', title: 'Title' },
  { key: 'type', title: 'Type' },
  { key: 'recipients', title: 'Recipients' },
  {
    key: 'status',
    title: 'Status',
    render: (alert: Alert) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        alert.status === 'Sent'
          ? 'bg-emerald-500/20 text-emerald-500'
          : 'bg-blue-500/20 text-blue-400'
      }`}>
        {alert.status}
      </span>
    )
  },
  { key: 'date', title: 'Date' }
];

export default function AlertsPage() {
  const [alerts] = useState<Alert[]>(mockAlerts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Alerts</h1>
        <p className="text-blue-100/60">Send and manage notifications to your customers</p>
      </div>

      <Card className="glass-effect border-blue-900/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg text-white">Create New Alert</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Title</Label>
              <Input
                placeholder="Enter alert title"
                className="bg-blue-950/50 border-blue-900/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Message</Label>
              <textarea
                rows={4}
                className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md p-2"
                placeholder="Enter your message"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Alert Type</Label>
                <select className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md">
                  <option value="notification">Push Notification</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Recipients</Label>
                <select className="w-full bg-blue-950/50 border-blue-900/30 text-white rounded-md">
                  <option value="all">All Customers</option>
                  <option value="premium">Premium Members</option>
                  <option value="new">New Customers</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Alert History</h2>
        <DataTable
          columns={columns}
          data={alerts}
          onRowClick={(alert) => {
            console.log('Alert clicked:', alert);
          }}
        />
      </div>
    </div>
  );
}