import { useState, useMemo, useCallback } from 'react';
import { PaginationSettings } from '../types/pokemon';

interface UsePaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  paginationSettings: PaginationSettings;
}

export const usePagination = <T,>(
  items: T[],
  initialSettings?: PaginationSettings
): UsePaginationResult<T> => {
  const [currentPage, setCurrentPage] = useState<number>(initialSettings?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialSettings?.itemsPerPage || 20);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);

  // Ensure current page is valid when items change
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Get current items for the page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // Get current pagination settings
  const paginationSettings = useMemo(() => ({
    currentPage,
    itemsPerPage,
  }), [currentPage, itemsPerPage]);

  return {
    currentItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    paginationSettings,
  };
};