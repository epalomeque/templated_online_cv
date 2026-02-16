import Handlebars from 'handlebars';

export interface TemplateContext {
  [key: string]: unknown;
}

class TemplateEngine {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  registerTemplate(name: string, source: string): void {
    const template = Handlebars.compile(source);
    this.templates.set(name, template);
  }

  registerPartial(name: string, source: string): void {
    Handlebars.registerPartial(name, source);
  }

  render(templateName: string, context: TemplateContext): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    return template(context);
  }

  hasTemplate(name: string): boolean {
    return this.templates.has(name);
  }

  clear(): void {
    this.templates.clear();
  }
}

export const templateEngine = new TemplateEngine();

export default Handlebars;
