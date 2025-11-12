import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/document';
import { useDemoDocuments } from '@/hooks/useDemoDocuments';

interface DroppableCategoryProps {
  category: Category | null; // null represents "All Documents"
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

interface DragItem {
  id: number;
  categoryId: number | null;
}

export function DroppableCategory({
  category,
  isSelected,
  onSelect,
  children,
}: DroppableCategoryProps) {
  const ref = useRef<HTMLButtonElement>(null);
  // Use demo hook for demo mode
  const { updateDocumentCategory } = useDemoDocuments();

  const [{ isOver }, connectDrop] = useDrop({
    accept: 'document',
    drop: (item: DragItem) => {
      const categoryId = category?.id || null;

      // Only update if the category is different
      if (item.categoryId !== categoryId) {
        updateDocumentCategory(item.id, categoryId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect the drop ref to our element
  connectDrop(ref);

  return (
    <Button
      ref={ref}
      variant={isSelected ? 'default' : 'ghost'}
      className={`justify-start flex-shrink-0 max-w-50 ${isOver ? 'bg-primary/20' : ''}`}
      onClick={onSelect}
    >
      {/* Only use children if provided, otherwise use the category name */}
      {children || category?.name || 'All Documents'}
    </Button>
  );
}
