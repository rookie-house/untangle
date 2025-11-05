'use client';

import { useState, useCallback, useEffect } from 'react';
import { mockCategories } from '@/lib/demo-data';
import { Category } from '@/types/document';

export function useDemoCategories() {
  // Initialize with mock categories immediately
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      setCategories(mockCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (name: string) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Get the highest ID from existing categories
      const highestId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) : 0;

      const newCategory: Category = {
        id: highestId + 1,
        name,
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Creating new category:', newCategory);
      setCategories((prev) => [...prev, newCategory]);
      console.log('Categories after update:', [...categories, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, name: string) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Update the category in the local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, name, updatedAt: new Date().toISOString() } : cat
        )
      );

      const updatedCategory = categories.find((c) => c.id === id);
      return updatedCategory
        ? { ...updatedCategory, name, updatedAt: new Date().toISOString() }
        : null;
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Remove the category from the local state
      const categoryToDelete = categories.find((c) => c.id === id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return categoryToDelete || null;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // We don't need to fetch categories on mount since we're initializing with mockCategories
  // If you want to simulate a fetch, you can uncomment this
  /*
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  */

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
