'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Plus, FileText, Image as ImageIcon, File } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';

type Collection = {
  id: string;
  name: string;
  color: string;
  count: number;
};

const AllDocumentsPage = () => {
  const [collections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Important Docs',
      color: 'bg-[#E4E3E8]',
      count: 5,
    },
    {
      id: '2',
      name: 'Finance Docs',
      color: 'bg-[#FBE9D0]',
      count: 8,
    },
    {
      id: '3',
      name: 'All Terms',
      color: 'bg-[#CFDEFC]',
      count: 12,
    },
    {
      id: '4',
      name: 'Property Agreement',
      color: 'bg-[#F4F2EF]',
      count: 3,
    },
    {
      id: '5',
      name: 'Property Agreement',
      color: 'bg-gray-100',
      count: 3,
    },
  ]);

  const { documents, loading: isLoading, loadingMore, hasMore, error, fetchDocuments } = useDocuments();

  const handleLoadMore = () => {
    fetchDocuments({ offset: documents.length, pageSize: 10 }, true);
  };

  const getDocumentIcon = (type: string) => {
    if (!type) return <File className="w-8 h-8 text-gray-500" />;
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'pptx':
      case 'ppt':
        return <File className="w-8 h-8 text-orange-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 rounded-2xl bg-white p-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Documents</h1>
        <p className="text-gray-500 mt-1">Explore collections and files.</p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className={`${collection.color} rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105`}
          >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-32">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Collection Name */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900">{collection.name}</h3>
              {collection.count > 0 && (
                <p className="text-sm text-gray-600">{collection.count} files</p>
              )}
            </div>
          </div>
        ))}

        {/* Add New Collection Card */}
        <div className="bg-gray-50 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[160px]">
          <button className="flex flex-col items-center gap-2">
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Add Collection</span>
          </button>
        </div>
      </div>

      {/* Recently Added Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading documents...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32 bg-red-50 rounded-xl border-2 border-dashed border-red-200">
            <div className="text-red-500">{error}</div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-gray-500">No documents found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((item) => (
              <div
                key={item.documents.id}
                onClick={() => window.open(item.documents.url, '_blank')}
                className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 group"
              >
                <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-blue-100 rounded-lg mb-3 flex items-center justify-center transition-colors">
                  {getDocumentIcon(item.documents.type)}
                </div>
                <h4 className="font-medium text-gray-900 text-sm truncate" title={item.documents.title}>
                  {item.documents.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {item.sessions ? item.sessions.title : 'No Session'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && documents.length > 0 && !isLoading && !error && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore ? 'Loading...' : 'Load More Documents'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDocumentsPage;
