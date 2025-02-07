export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer: string;
  email: string;
  phone: string;
  type: 'delivery' | 'pickup';
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  date: string;
  address?: string;
}

export interface CreateOrderDto {
  customer: string;
  email: string;
  phone: string;
  type: 'delivery' | 'pickup';
  items: Omit<OrderItem, 'id'>[];
  address?: string;
}

export interface UpdateOrderDto {
  status?: Order['status'];
  address?: string;
}