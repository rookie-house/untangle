'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Document } from '@/types/document';
import { useAuth } from './useAuth';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDocuments = useCallback(
    async (params?: { pageSize?: number; offset?: number }, append = false) => {
      if (!user) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await api.documents.getDocuments(params);
        let newDocs: Document[] = [];

        if (response?.success && response?.data?.documents) {
          newDocs = response.data.documents;
        } else if (response?.data && Array.isArray(response.data)) {
          newDocs = response.data;
        }

        const pageSize = params?.pageSize || 10;
        setHasMore(newDocs.length >= pageSize);

        if (append) {
          setDocuments((prev) => [...prev, ...newDocs]);
        } else {
          setDocuments(newDocs);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [user]
  );

  const fetchDocumentById = async (id: number | string) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.documents.getDocumentById(Number(id) || 0); // Convert if needed
      setSelectedDocument(response.data?.document || response.data);
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
      if (response?.success && response?.data?.documents) {
        setDocuments(response.data.documents);
      } else if (response?.data && Array.isArray(response.data)) {
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

  const updateDocumentCategory = async (documentId: number | string, categoryId: number | null) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.documents.updateDocumentCategory(Number(documentId) || 0, categoryId);
      // Update the document in the local state
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.documents.id === documentId.toString()) {
            return {
              ...doc,
              // categoryId is not part of the new schema, but you might want to handle it appropriately
            };
          }
          return doc;
        })
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
      fetchDocuments({ pageSize: 10, offset: 0 });
    }
  }, [user, fetchDocuments]);

  return {
    documents,
    selectedDocument,
    loading,
    loadingMore,
    hasMore,
    error,
    fetchDocuments,
    fetchDocumentById,
    fetchDocumentsBySession,
    uploadDocument,
    updateDocumentCategory,
    setSelectedDocument,
  };
}
