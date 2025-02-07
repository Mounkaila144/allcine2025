'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { Star, TrendingUp, MessageSquare } from 'lucide-react';

interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    customer: 'Sarah Johnson',
    rating: 5,
    comment: 'Excellent service and amazing food!',
    date: '2024-03-27',
    status: 'Published'
  },
  // Add more mock reviews...
];

const columns = [
  { key: 'customer', title: 'Customer' },
  {
    key: 'rating',
    title: 'Rating',
    render: (review: Review) => (
      <div className="flex items-center space-x-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
    )
  },
  { key: 'comment', title: 'Comment' },
  { key: 'date', title: 'Date' },
  {
    key: 'status',
    title: 'Status',
    render: (review: Review) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        review.status === 'Published' 
          ? 'bg-emerald-500/20 text-emerald-500'
          : 'bg-yellow-500/20 text-yellow-500'
      }`}>
        {review.status}
      </span>
    )
  },
];

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reviews</h1>
        <p className="text-blue-100/60">Manage your customer reviews</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Average Rating"
          value="4.8"
          icon={Star}
          trend="+0.2"
          description="vs. last month"
        />
        <StatCard
          title="Total Reviews"
          value="342"
          icon={MessageSquare}
          trend="+15.3%"
          description="vs. last month"
        />
        <StatCard
          title="Response Rate"
          value="95%"
          icon={TrendingUp}
          trend="+2.4%"
          description="vs. last month"
        />
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        onRowClick={(review) => {
          console.log('Review clicked:', review);
        }}
      />
    </div>
  );
}