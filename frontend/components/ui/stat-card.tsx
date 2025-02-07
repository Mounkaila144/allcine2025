'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <Card className="glass-effect border-blue-900/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-blue-100/80">{title}</CardTitle>
        <Icon className="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        {trend && description && (
          <p className="text-sm text-blue-100/60">
            <span className="text-emerald-500">{trend}</span>
            {' '}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}