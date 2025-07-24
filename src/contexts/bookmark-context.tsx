'use client';

import { createContext, useContext, useState } from 'react';

import type { Bookmark } from '@/types';

interface BookmarkContextProps {
  selectedBookmark: Bookmark | null;
  setSelectedBookmark: React.Dispatch<React.SetStateAction<Bookmark | null>>;
}

interface BookmarkProviderProps {
  children: React.ReactNode;
}

const BookmarkContext = createContext<BookmarkContextProps | null>(null);

export function useBookmark() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error('useBookmark must be used within a <BookmarkProvider />');
  }

  return context;
}

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );

  return (
    <BookmarkContext.Provider
      value={{
        selectedBookmark,
        setSelectedBookmark
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
