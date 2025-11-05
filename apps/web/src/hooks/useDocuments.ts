'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Document } from '@/types/document';
import { useAuth } from './useAuth';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDocuments = useCallback(
    async (params?: { pageSize?: number; offset?: number }) => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.documents.getDocuments(params);
        if (response.data && Array.isArray(response.data)) {
          setDocuments(response.data);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const fetchDocumentById = async (id: number) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.documents.getDocumentById(id);
      setSelectedDocument(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentsBySession = async (sessionId: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.documents.getDocumentsBySession(sessionId);
      if (response.data && Array.isArray(response.data)) {
        setDocuments(response.data);
      }
      return response.data;
    } catch (err) {
      console.error('Error fetching session documents:', err);
      setError('Failed to load session documents');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.documents.uploadDocument(file);
      // Refresh the documents list after uploading
      await fetchDocuments();
      return response.data;
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentCategory = async (documentId: number, categoryId: number | null) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.documents.updateDocumentCategory(documentId, categoryId);
      // Update the document in the local state
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? { ...doc, categoryId } : doc))
      );
      return response.data;
    } catch (err) {
      console.error('Error updating document category:', err);
      setError('Failed to update document category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, fetchDocuments]);

  return {
    documents,
    selectedDocument,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    fetchDocumentsBySession,
    uploadDocument,
    updateDocumentCategory,
    setSelectedDocument,
  };
}
