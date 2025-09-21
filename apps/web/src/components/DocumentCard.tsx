import React from 'react';
import { Document } from '@/types/document';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FiFile, FiFileText, FiImage } from 'react-icons/fi';

interface DocumentCardProps {
    document: Document;
    onSelect: (document: Document) => void;
    isDragging?: boolean;
}

export function DocumentCard({ document, onSelect, isDragging = false }: DocumentCardProps) {
    // Determine icon based on document type
    const DocumentIcon = document.type === 'image'
        ? FiImage
        : document.type === 'pdf'
            ? FiFileText
            : FiFile;

    // Format date to display
    const formattedDate = new Date(document.updatedAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <Card
            className={`cursor-pointer hover:border-primary/50 transition-all ${isDragging ? 'opacity-50' : ''}`}
            onClick={() => onSelect(document)}
        >
            <CardContent className="p-4">
                {/* Document Icon/Preview */}
                <div className="mb-4 bg-secondary/20 aspect-square rounded-md flex items-center justify-center">
                    {document.type === 'image' ? (
                        <img
                            src={document.url}
                            alt={document.title}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                                // If image fails to load, show icon instead
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center h-full w-full">
                  <svg class="w-12 h-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>`;
                            }}
                        />
                    ) : (
                        <DocumentIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                </div>

                {/* Document Title */}
                <h3 className="font-medium text-sm line-clamp-2" title={document.title}>
                    {document.title}
                </h3>
            </CardContent>

            <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t">
                {formattedDate}
            </CardFooter>
        </Card>
    );
}