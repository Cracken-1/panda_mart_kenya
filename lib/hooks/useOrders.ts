import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_id: string;
}

interface OrderStatusHistory {
  id: string;
  status: string;
  notes: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  created_at: string;
  updated_at: string;
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  order_items: OrderItem[];
  order_status_history?: OrderStatusHistory[];
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (page: number = 1, status?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/orders?${params}`);
      const data: OrdersResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    if (!user) return null;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }
      
      return data.order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      return null;
    }
  };

  const createOrder = async (orderData: {
    items: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
    }>;
    shipping_address: any;
    billing_address: any;
    payment_method: string;
  }) => {
    if (!user) {
      setError('Please log in to place an order');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
      
      await fetchOrders(); // Refresh orders list
      return data.order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel order');
      }
      
      await fetchOrders(); // Refresh orders list
      return data.order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    }
  }, [user]);

  return {
    orders,
    pagination,
    loading,
    error,
    fetchOrders,
    getOrder,
    createOrder,
    cancelOrder,
  };
}