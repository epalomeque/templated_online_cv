import { ThemeName } from './handlebarsSetup';

export interface ThemeOption {
  id: ThemeName;
  label: string;
}

/**
 * Service to manage available resume themes.
 */
export const themeService = {
  /**
   * Returns the list of all available themes.
   * @returns Array of ThemeOption
   */
  getAvailableThemes(): ThemeOption[] {
    return [
      { id: 'simple', label: 'Simple' },
      { id: 'bootstrap', label: 'Bootstrap' }
    ];
  },

  /**
   * Returns a theme by its ID.
   * @param id - The theme ID.
   * @returns The theme option or simple as default.
   */
  getThemeById(id: ThemeName): ThemeOption {
    const themes = this.getAvailableThemes();
    return themes.find(t => t.id === id) || themes[0];
  }
};
