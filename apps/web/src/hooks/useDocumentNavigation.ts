'use client';

import { useRouter } from 'next/navigation';
import { Document } from '@/types/document';

export const useDocumentNavigation = () => {
  const router = useRouter();

  const navigateToDocumentDetail = (document: Document) => {
    router.push(`/document/${document.id}`);
  };

  return {
    navigateToDocumentDetail,
  };
};
