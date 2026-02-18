import Handlebars from 'handlebars';
import { singleThemeTemplates } from '../features/resume-viewer/templates/single-theme/templates';
import { bootstrapThemeTemplates } from '../features/resume-viewer/templates/bootstrap-theme/templates';

export type ThemeName = 'simple' | 'bootstrap';

interface TemplateCache {
  [key: string]: HandlebarsTemplateDelegate;
}

const templateCache: TemplateCache = {};

Handlebars.registerPartial('sectionTitle', singleThemeTemplates.sectionTitle);

Handlebars.registerHelper('range', function(start: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < start; i++) {
    result.push(i);
  }
  return result;
});

Handlebars.registerHelper('rangeEmpty', function(total: number, filled: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < (total - filled); i++) {
    result.push(i);
  }
  return result;
});

Handlebars.registerHelper('ifNotEmpty', function(this: unknown, array: unknown[], options: Handlebars.HelperOptions): string {
  if (array && array.length > 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('multiply', function(a: number, b: number): number {
  return a * b;
});

const registeredThemes = new Set<ThemeName>();

/**
 * Loads and compiles templates for a specific theme if they are not already registered.
 * 
 * @param theme - The name of the theme to load.
 */
export function loadTemplates(theme: ThemeName): void {
  if (registeredThemes.has(theme)) return;
  
  const templates = theme === 'bootstrap' ? bootstrapThemeTemplates : singleThemeTemplates;
  
  Object.entries(templates).forEach(([name, source]) => {
    if (name !== 'sectionTitle') {
      templateCache[`${theme}.${name}`] = Handlebars.compile(source);
    }
  });
  
  registeredThemes.add(theme);
}

/**
 * Renders a complete theme layout with all its sections.
 * 
 * @param theme - The theme name.
 * @param sections - An object where keys are section names and values are their rendered HTML.
 * @returns The complete rendered layout.
 */
export function renderLayout(theme: ThemeName, sections: Record<string, string>): string {
  loadTemplates(theme);
  return renderTemplate(theme, 'layout', sections);
}

/**
 * Retrieves the embedded styles for a specific theme.
 * 
 * @param theme - The theme name.
 * @returns The CSS styles as a string.
 */
export function getThemeStyles(theme: ThemeName): string {
  loadTemplates(theme);
  const templates = theme === 'bootstrap' ? bootstrapThemeTemplates : singleThemeTemplates;
  return (templates as any).styles || '';
}

/**
 * Retrieves the external CSS links for a specific theme.
 * 
 * @param theme - The theme name.
 * @returns An array of URLs to external CSS files.
 */
export function getThemeExternalCss(theme: ThemeName): string[] {
  loadTemplates(theme);
  const templates = theme === 'bootstrap' ? bootstrapThemeTemplates : singleThemeTemplates;
  return (templates as any).externalCss || [];
}

/**
 * Renders a previously loaded template with the provided context.
 * 
 * @param theme - The theme the template belongs to.
 * @param templateName - The name of the template to render.
 * @param context - The data to pass to the template.
 * @returns The rendered string.
 * @throws Error if the template has not been loaded.
 */
export function renderTemplate(theme: ThemeName, templateName: string, context: Record<string, unknown>): string {
  const template = templateCache[`${theme}.${templateName}`];
  if (!template) {
    throw new Error(`Template '${theme}.${templateName}' not found`);
  }
  return template(context);
}

export { Handlebars };
