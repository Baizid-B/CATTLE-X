export const useFavorites = () => {
  return {
    favorites: [] as string[],
    toggleFavorite: (_cowId: string) => {},
    isFavorite: (_id: string) => false,
  };
};
