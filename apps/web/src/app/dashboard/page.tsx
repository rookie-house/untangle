"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiUpload, FiFolder, FiUser, FiGrid, FiList } from 'react-icons/fi';
import { DraggableDocumentCard } from '@/components/DraggableDocumentCard';
import { DraggableDocumentListItem } from '@/components/DraggableDocumentListItem';
import { FileUploadModal } from '@/components/FileUploadModal';
import { DocumentDetail } from '@/components/DocumentDetail';
import { CategoryList } from '@/components/CategoryList';
import { Document } from '@/types/document';
import { mockUser, mockDocuments, mockCategories } from '@/lib/demo-data';

// For the demo, we'll use modified hooks to use mock data instead of making API calls
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoDocuments } from '@/hooks/useDemoDocuments';
import { useDemoCategories } from '@/hooks/useDemoCategories';
import { DemoCategoryList } from '@/components/DemoCategoryList';
import { useDocumentNavigation } from '@/hooks/useDocumentNavigation';

export default function Dashboard() {
  const { user } = useDemoAuth();
  const {
    documents,
    loading,
    updateDocumentCategory,
    selectedDocument,
    setSelectedDocument,
    fetchDocumentById,
    fetchDocuments
  } = useDemoDocuments();
  const { navigateToDocumentDetail } = useDocumentNavigation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Filter documents by selected category
  const filteredDocuments = useMemo(() => {
    if (selectedCategoryId === null) {
      return documents;
    }
    return documents.filter(doc => doc.categoryId === selectedCategoryId);
  }, [documents, selectedCategoryId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        {/* File Upload Modal */}
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />

        {/* Document Detail Modal */}
        {selectedDocument && (
          <DocumentDetail
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}

        {/* Header with welcome message and upload button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground">Manage and organize your documents</p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <FiUpload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories and Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiUser className="w-4 h-4" /> My Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.name || 'User'}</h3>
                    <p className="text-muted-foreground text-sm">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiFolder className="w-4 h-4" /> Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <DemoCategoryList
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Documents */}
          <div className="lg:col-span-3">
            {/* View Toggle and Search */}
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <FiList className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-muted-foreground text-sm">
                {loading ? "Loading..." : `${documents.length} document${documents.length !== 1 ? "s" : ""}`}
              </div>
            </div>

            {/* Documents Area */}
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : documents.length === 0 ? (
              <div className="border border-dashed border-border rounded-lg h-48 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No documents yet</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    Upload your first document
                  </Button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map(document => (
                  <DraggableDocumentCard
                    key={document.id}
                    document={document}
                    onSelect={(doc) => navigateToDocumentDetail(doc)}
                  />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg divide-y">
                {filteredDocuments.map(document => (
                  <DraggableDocumentListItem
                    key={document.id}
                    document={document}
                    onSelect={(doc) => navigateToDocumentDetail(doc)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}