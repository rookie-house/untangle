import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FiUpload, FiX } from 'react-icons/fi';
import { useDemoDocuments } from '@/hooks/useDemoDocuments';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  // Use demo hook for demo mode
  const { uploadDocument } = useDemoDocuments();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpeg', '.jpg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      // Upload each file
      for (const file of files) {
        await uploadDocument(file);
      }
      // Clear files and close modal
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Documents</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <FiX className="h-4 w-4" />
          </Button>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'bg-primary/5 border-primary/50' : ''
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-muted-foreground">Drop files here...</p>
          ) : (
            <>
              <p className="text-muted-foreground mb-1">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, images, Word documents, and text files
              </p>
            </>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-secondary/10 p-2 rounded-md text-sm"
                >
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <FiX className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload className="h-4 w-4" />
                Upload {files.length > 0 ? `(${files.length})` : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
