import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  products: {
    id: string;
    name: string;
    image_url: string;
  };
}

export function useReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (productId?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = productId ? `?product_id=${productId}` : '';
      const response = await fetch(`/api/reviews${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }
      
      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: {
    product_id: string;
    rating: number;
    comment?: string;
  }) => {
    if (!user) {
      setError('Please log in to write a review');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create review');
      }
      
      await fetchReviews(); // Refresh reviews list
      return data.review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, updates: {
    rating: number;
    comment?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update review');
      }
      
      await fetchReviews(); // Refresh reviews list
      return data.review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review');
      }
      
      await fetchReviews(); // Refresh reviews list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasReviewedProduct = (productId: string) => {
    return reviews.some(review => review.products.id === productId);
  };

  const getProductReview = (productId: string) => {
    return reviews.find(review => review.products.id === productId);
  };

  useEffect(() => {
    if (user) {
      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [user]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    hasReviewedProduct,
    getProductReview,
  };
}