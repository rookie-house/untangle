import React from 'react';
import { Document } from '@/types/document';
import { FiFile, FiFileText, FiImage } from 'react-icons/fi';

interface DocumentListItemProps {
  document: Document;
  onSelect: (document: Document) => void;
  isDragging?: boolean;
}

export function DocumentListItem({
  document,
  onSelect,
  isDragging = false,
}: DocumentListItemProps) {
  // Determine icon based on document type
  const DocumentIcon =
    document.type === 'image' ? FiImage : document.type === 'pdf' ? FiFileText : FiFile;

  // Format date to display
  const formattedDate = new Date(document.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`flex items-center p-3 hover:bg-secondary/10 rounded-md cursor-pointer transition-colors ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(document)}
    >
      <div className="mr-3">
        <DocumentIcon className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate" title={document.title}>
          {document.title}
        </h3>
      </div>

      <div className="text-xs text-muted-foreground">{formattedDate}</div>
    </div>
  );
}
