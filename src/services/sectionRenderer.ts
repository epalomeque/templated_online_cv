import CVData from '../classes/cv_data';
import { loadTemplates, renderTemplate, ThemeName } from './handlebarsSetup';

export interface SectionTemplateProps {
  title: string;
  cvData: CVData;
  theme: ThemeName;
}

export function renderSection(
  sectionType: string,
  title: string,
  cvData: CVData,
  theme: ThemeName
): string {
  loadTemplates(theme);
  
  const context = getSectionContext(sectionType, title, cvData);
  return renderTemplate(theme, sectionType, context);
}

function getSectionContext(
  sectionType: string,
  title: string,
  cvData: CVData
): object {
  switch (sectionType) {
    case 'header':
      return {
        name: cvData.getName(),
        lastName: cvData.getLastName(),
        email: cvData.getFirstEmail(),
        phone: cvData.getCellPhone(),
        socialMedia: cvData.getSocialMedia(),
        aboutTitle: cvData.getAboutTitle(),
        aboutDescription: cvData.getAboutDescription(),
      };
    case 'experience':
      return {
        title,
        items: cvData.getExperience() || [],
      };
    case 'education':
      return {
        title,
        items: cvData.getEducation() || [],
      };
    case 'projects':
      return {
        title,
        items: cvData.getProjects() || [],
      };
    case 'skills':
      return {
        title,
        items: cvData.getAbilities() || [],
      };
    case 'interests':
      return {
        title,
        items: cvData.getInterests() || [],
      };
    case 'language':
      return {
        title,
        items: cvData.getLanguages() || [],
      };
    default:
      return { title, items: [] };
  }
}
