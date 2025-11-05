import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Document } from '@/types/document';
import { DocumentListItem as BaseDocumentListItem } from './DocumentListItem';

interface DraggableDocumentListItemProps {
  document: Document;
  onSelect: (document: Document) => void;
}

export function DraggableDocumentListItem({ document, onSelect }: DraggableDocumentListItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, connectDrag] = useDrag({
    type: 'document',
    item: { id: document.id, categoryId: document.categoryId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Connect the drag ref to our element
  connectDrag(ref);

  return (
    <div ref={ref}>
      <BaseDocumentListItem document={document} onSelect={onSelect} isDragging={isDragging} />
    </div>
  );
}
