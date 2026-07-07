'use client'

import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = title ? `${title} - Pedoman` : 'Pedoman';

    // Optionally, you can reset the title when the component unmounts
    return () => {
      document.title = 'Pedoman';
    };
  }, [title]); // Re-run effect when title changes
}; 
