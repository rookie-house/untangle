import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Category } from '@/types/document';
import { DroppableCategory } from './DroppableCategory';
import { useDemoCategories } from '@/hooks/useDemoCategories';

interface CategoryInputProps {
    onComplete: () => void;
    initialValue?: string;
    categoryId?: number;
    isEdit?: boolean;
}

function CategoryInput({ onComplete, initialValue = '', categoryId, isEdit = false }: CategoryInputProps) {
    const [value, setValue] = useState(initialValue);
    const { createCategory, updateCategory } = useDemoCategories();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            console.log('Submitting category:', value.trim());
            if (isEdit && categoryId) {
                console.log('Updating category:', categoryId, value.trim());
                await updateCategory(categoryId, value.trim());
            } else {
                console.log('Creating new category:', value.trim());
                const result = await createCategory(value.trim());
                console.log('Category created:', result);
            }
            onComplete();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-1">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Category name"
                autoFocus
            />
            <Button type="submit" variant="default" size="sm" className="h-8">
                {isEdit ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8" onClick={onComplete}>
                Cancel
            </Button>
        </form>
    );
}

interface DemoCategoryListProps {
    selectedCategoryId: number | null;
    onSelectCategory: (id: number | null) => void;
}

export function DemoCategoryList({ selectedCategoryId, onSelectCategory }: DemoCategoryListProps) {
    const { categories, deleteCategory } = useDemoCategories();
    const [isAdding, setIsAdding] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    const handleEditCategory = (category: Category, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCategoryId(category.id);
    };

    const handleDeleteCategory = async (categoryId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this category? This will not delete the documents inside.')) {
            await deleteCategory(categoryId);
            if (selectedCategoryId === categoryId) {
                onSelectCategory(null);
            }
        }
    };

    return (
        <div className="space-y-2">
            <DroppableCategory
                category={null}
                isSelected={selectedCategoryId === null}
                onSelect={() => onSelectCategory(null)}
            />

            {categories.map(category => (
                editingCategoryId === category.id ? (
                    <CategoryInput
                        key={category.id}
                        onComplete={() => setEditingCategoryId(null)}
                        initialValue={category.name}
                        categoryId={category.id}
                        isEdit
                    />
                ) : (
                    <div key={category.id} className="flex w-full items-center">
                        <DroppableCategory
                            category={category}
                            isSelected={selectedCategoryId === category.id}
                            onSelect={() => onSelectCategory(category.id)}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-1"
                            onClick={(e) => handleEditCategory(category, e)}
                        >
                            <FiEdit2 className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => handleDeleteCategory(category.id, e)}
                        >
                            <FiTrash2 className="h-3 w-3" />
                        </Button>
                    </div>
                )
            ))}

            {isAdding ? (
                <CategoryInput onComplete={() => setIsAdding(false)} />
            ) : (
                <Button
                    variant="ghost"
                    className="w-full justify-start text-primary"
                    onClick={() => setIsAdding(true)}
                >
                    <FiPlus className="mr-1 h-4 w-4" /> Add Category
                </Button>
            )}
        </div>
    );
}