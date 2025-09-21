"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Category } from "@/types/document";
import { useAuth } from "./useAuth";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCategories = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.categories.getCategories();
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createCategory = async (name: string) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.categories.createCategory(name);
      // Refresh the categories list after creating
      await fetchCategories();
      return response.data;
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, name: string) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.categories.updateCategory(id, name);
      // Update the category in the local state
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.categories.deleteCategory(id);
      // Remove the category from the local state
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return response.data;
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, fetchCategories]);

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
