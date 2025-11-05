import React from 'react';
import { Document } from '@/types/document';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiX, FiFile, FiFileText, FiImage, FiDownload, FiExternalLink } from 'react-icons/fi';

interface DocumentDetailProps {
  document: Document | null;
  onClose: () => void;
}

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  if (!document) return null;

  // Determine icon based on document type
  const DocumentIcon =
    document.type === 'image' ? FiImage : document.type === 'pdf' ? FiFileText : FiFile;

  // Format dates
  const createdDate = new Date(document.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const updatedDate = new Date(document.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <DocumentIcon className="h-5 w-5" />
            Document Details
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <FiX className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-6">
            {/* Document Preview */}
            <div className="bg-secondary/10 aspect-video rounded-md flex items-center justify-center">
              {document.type === 'image' ? (
                <img
                  src={document.url}
                  alt={document.title}
                  className="max-h-[50vh] max-w-full object-contain rounded-md"
                  onError={(e) => {
                    // If image fails to load, show icon instead
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center h-full w-full">
                      <svg class="w-16 h-16 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>`;
                  }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <DocumentIcon className="w-16 h-16 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {document.type.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-medium">{document.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {document.type.charAt(0).toUpperCase() + document.type.slice(1)} Document
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Uploaded On</p>
                  <p>{createdDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Modified</p>
                  <p>{updatedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p>
                    {document.categoryId ? `Category #${document.categoryId}` : 'Uncategorized'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Document ID</p>
                  <p>#{document.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FiDownload className="h-4 w-4" />
            Download
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => window.open(document.url, '_blank')}
          >
            <FiExternalLink className="h-4 w-4" />
            Open
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
