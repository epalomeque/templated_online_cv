import CVData from '../classes/cv_data';
import { ThemeName } from '../services/handlebarsSetup';
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
  
  // Basic structure depending on the theme
  const isBootstrap = theme === 'bootstrap';
  
  let bodyContent = '';
  if (isBootstrap) {
    bodyContent = `
      <div class="container-xl bootstrap-resume">
        <div class="row">
          <div class="col-12">
            ${renderSection('header', '', cvData, theme)}
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            ${renderSection('language', 'Languages', cvData, theme)}
            ${renderSection('experience', 'Experience', cvData, theme)}
            ${renderSection('education', 'Education', cvData, theme)}
          </div>
          <div class="col-12 col-md-6">
            ${renderSection('projects', 'Projects', cvData, theme)}
            ${renderSection('skills', 'Skills', cvData, theme)}
            ${renderSection('interests', 'Interests', cvData, theme)}
          </div>
        </div>
      </div>
    `;
  } else {
    bodyContent = `
      <div class="container">
        ${renderSection('header', '', cvData, theme)}
        <div class="details">
          ${renderSection('language', 'Languages', cvData, theme)}
          ${renderSection('experience', 'Experience', cvData, theme)}
          ${renderSection('education', 'Education', cvData, theme)}
          ${renderSection('projects', 'Projects', cvData, theme)}
          ${renderSection('skills', 'Skills', cvData, theme)}
          ${renderSection('interests', 'Interests', cvData, theme)}
        </div>
      </div>
    `;
  }

  const bootstrapCss = isBootstrap ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">' : '';
  const googleFonts = !isBootstrap ? '<link href="https://fonts.googleapis.com/css?family=Lato:400,300,700" rel="stylesheet" type="text/css">' : '';
  const fontAwesome = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${bootstrapCss}
    ${googleFonts}
    ${fontAwesome}
    <style>
        /* Base styles would go here, but since we are generating a standalone HTML, 
           ideally we would need to extract the compiled CSS. 
           For now, we'll use a simplified version or the user can provide the CSS. */
        body {
            background: #eee;
            margin: 0;
            padding: 20px;
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
