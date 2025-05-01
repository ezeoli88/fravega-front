import { createContext, useContext, useState, ReactNode } from 'react';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (username: string) => void;
  isFavorite: (username: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (username: string) => {
    setFavorites(prev => 
      prev.includes(username)
        ? prev.filter(fav => fav !== username)
        : [...prev, username]
    );
  };

  const isFavorite = (username: string): boolean => {
    return favorites.includes(username);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
