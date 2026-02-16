import Handlebars from 'handlebars';
import { singleThemeTemplates } from '../templates/single-theme/templates';
import { bootstrapThemeTemplates } from '../templates/bootstrap-theme/templates';

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

export function renderTemplate(theme: ThemeName, templateName: string, context: object): string {
  const template = templateCache[`${theme}.${templateName}`];
  if (!template) {
    throw new Error(`Template '${theme}.${templateName}' not found`);
  }
  return template(context);
}

export { Handlebars };
