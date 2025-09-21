"use client";

import { useState, useEffect, useCallback } from "react";
import { mockDocuments } from "@/lib/demo-data";
import { Document } from "@/types/document";

export function useDemoDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(
    async (params?: { pageSize?: number; offset?: number }) => {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        setDocuments(mockDocuments);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDocumentById = async (id: number) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const document = mockDocuments.find((doc) => doc.id === id) || null;
      setSelectedDocument(document);
      return document;
    } catch (err) {
      console.error("Error fetching document:", err);
      setError("Failed to load document");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentsBySession = async (sessionId: string) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // In a demo, we'll just return all documents since we don't have sessions
      setDocuments(mockDocuments);
      return mockDocuments;
    } catch (err) {
      console.error("Error fetching session documents:", err);
      setError("Failed to load session documents");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type === "application/pdf"
          ? "pdf"
          : "other";

      const newDocument: Document = {
        id: Math.max(0, ...documents.map((d) => d.id)) + 1,
        title: file.name,
        type: fileType,
        url:
          fileType === "image"
            ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574"
            : "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1000",
        userId: 1,
        categoryId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocuments((prev) => [...prev, newDocument]);
      return newDocument;
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("Failed to upload document");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentCategory = async (
    documentId: number,
    categoryId: number | null
  ) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Update the document in the local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, categoryId, updatedAt: new Date().toISOString() }
            : doc
        )
      );

      // If the selected document is the one being updated, update it too
      if (selectedDocument && selectedDocument.id === documentId) {
        setSelectedDocument({
          ...selectedDocument,
          categoryId,
          updatedAt: new Date().toISOString(),
        });
      }

      const updatedDoc = documents.find((doc) => doc.id === documentId);
      return updatedDoc
        ? { ...updatedDoc, categoryId, updatedAt: new Date().toISOString() }
        : null;
    } catch (err) {
      console.error("Error updating document category:", err);
      setError("Failed to update document category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents when the component mounts
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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
