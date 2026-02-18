import CVData from '../classes/cv_data';
import { ThemeName, renderLayout, getThemeStyles, getThemeExternalCss, getThemeExternalScripts } from '../services/handlebarsSetup';
import { renderSection } from '../services/sectionRenderer';

/**
 * Generates an independent HTML string for the resume with embedded styles.
 * 
 * @param cvData - The CV data instance.
 * @param theme - The theme name to use.
 * @returns The complete HTML document as a string.
 */
export function generateResumeHtml(cvData: CVData, theme: ThemeName): string {
  const title = `${cvData.getFullName()} - Resume`;
  
  // Sections to render
  const sectionTypes = ['header', 'language', 'experience', 'education', 'projects', 'skills', 'interests'];
  const titles: Record<string, string> = {
    language: 'Languages',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    interests: 'Interests'
  };

  const sections: Record<string, string> = {};
  sectionTypes.forEach(type => {
    sections[type] = renderSection(type, titles[type] || '', cvData, theme);
  });

  // Render the layout
  const bodyContent = renderLayout(theme, sections);

  // Get styles and scripts
  const externalCssLinks = getThemeExternalCss(theme)
    .map(url => `<link href="${url}" rel="stylesheet">`)
    .join('\n    ');

  const externalScripts = getThemeExternalScripts(theme)
    .map(url => `<script src="${url}"></script>`)
    .join('\n    ');
  
  const themeCss = getThemeStyles(theme);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${externalCssLinks}
    ${externalScripts}
    <style>
        ${themeCss}
        body {
            background: #eee;
            margin: 0;
            padding: 20px 0;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container, .container-xl {
                box-shadow: none !important;
                margin: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    ${bodyContent}
</body>
</html>
  `;
}

/**
 * Generates and triggers the download of the resume as an HTML file.
 * 
 * @param cvData - The CV data instance.
 * @param theme - The theme name to use.
 */
export function downloadResumeHtml(cvData: CVData, theme: ThemeName): void {
  const htmlContent = generateResumeHtml(cvData, theme);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cvData.getFullName().replace(/\s+/g, '_')}_Resume.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
