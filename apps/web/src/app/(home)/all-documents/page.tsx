'use client';

import React, { useState } from 'react';
import { ExternalLink, Plus } from 'lucide-react';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
            >
              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto"></div>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Document {item}</h4>
              <p className="text-xs text-gray-500 mt-1">Property Agreement</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllDocumentsPage;
