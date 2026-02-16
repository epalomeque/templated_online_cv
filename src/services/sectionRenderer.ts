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
    case 'header': {
      const aboutTitle = cvData.getAboutTitle();
      const aboutDesc = cvData.getAboutDescription();
      const socialMedia = cvData.getSocialMedia();
      return {
        name: cvData.getName() || '',
        lastName: cvData.getLastName() || '',
        email: cvData.getFirstEmail() || '',
        phone: cvData.getCellPhone() || '',
        socialMedia: socialMedia && socialMedia.length > 0 ? socialMedia : null,
        hasAbout: !!(aboutTitle || aboutDesc),
        aboutTitle: aboutTitle,
        aboutDescription: aboutDesc,
      };
    }
    case 'experience': {
      const experience = cvData.getExperience();
      return {
        title,
        hasItems: !!(experience && experience.length > 0),
        items: experience || [],
      };
    }
    case 'education': {
      const education = cvData.getEducation();
      return {
        title,
        hasItems: !!(education && education.length > 0),
        items: education || [],
      };
    }
    case 'projects': {
      const projects = cvData.getProjects();
      return {
        title,
        hasItems: !!(projects && projects.length > 0),
        items: projects || [],
      };
    }
    case 'skills': {
      const skills = cvData.getAbilities();
      const skillsWithLevels = (skills || []).map(skill => ({
        ...skill,
        levels: Array.from({ length: 10 }, (_, i) => i < skill.level)
      }));
      return {
        title,
        hasItems: !!(skills && skills.length > 0),
        items: skillsWithLevels,
      };
    }
    case 'interests': {
      const interests = cvData.getInterests();
      return {
        title,
        hasItems: !!(interests && interests.length > 0),
        items: interests || [],
      };
    }
    case 'language': {
      const languages = cvData.getLanguages();
      return {
        title,
        hasItems: !!(languages && languages.length > 0),
        items: languages || [],
      };
    }
    default:
      return { title, hasItems: false, items: [] };
  }
}
