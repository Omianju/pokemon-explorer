const FAVORITES_KEY = 'pokemon_favorites';
const UI_SETTINGS_KEY = 'pokemon_ui_settings';

// Favorites Storage
export const getFavorites = (): number[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites: number[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

// UI Settings Storage
interface UISettings {
  pagination: {
    itemsPerPage: number;
    currentPage: number;
  };
  sorting: string;
  filters: {
    types: string[];
  };
}

export const getUISettings = (): UISettings => {
  try {
    const storedSettings = localStorage.getItem(UI_SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    // Default settings
    return {
      pagination: {
        itemsPerPage: 20,
        currentPage: 1,
      },
      sorting: 'id_asc',
      filters: {
        types: [],
      },
    };
  } catch (error) {
    console.error('Error getting UI settings from localStorage:', error);
    return {
      pagination: {
        itemsPerPage: 20,
        currentPage: 1,
      },
      sorting: 'id_asc',
      filters: {
        types: [],
      },
    };
  }
};

export const saveUISettings = (settings: UISettings): void => {
  try {
    localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving UI settings to localStorage:', error);
  }
};