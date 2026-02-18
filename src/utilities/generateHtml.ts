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

  const simpleThemeCss = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #eee; font-family: 'Lato', sans-serif; font-weight: 400; color: #222; font-size: 14px; line-height: 26px; padding: 20px 0 50px 0; }
    .container { max-width: 700px; background: #fff; margin: 0 auto; box-shadow: 1px 1px 2px #DAD7D7; border-radius: 3px; padding: 40px; margin-top: 20px; }
    .header { margin-bottom: 30px; }
    .header .full-name { font-size: 40px; text-transform: uppercase; margin-bottom: 15px; }
    .header .first-name { font-weight: 700; }
    .header .last-name { font-weight: 300; }
    .header .contact-info { margin-bottom: 5px; }
    .header .social-media-info { display: flex; justify-content: space-around; margin-bottom: 15px; }
    .header .email, .header .phone { color: #999; font-weight: 300; }
    .header .separator { height: 10px; display: inline-block; border-left: 2px solid #999; margin: 0 10px; }
    .header .position { font-weight: bold; display: inline-block; margin-right: 10px; text-decoration: underline; }
    .details { line-height: 20px; }
    .details .section, .details .section__language { margin-bottom: 40px; }
    .details .section:last-of-type { margin-bottom: 0; }
    .details .section__title { letter-spacing: 2px; color: #54AFE4; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
    .details .section__language .section__list { display: flex; justify-content: space-evenly; flex-direction: row; }
    .details .section__list-item { margin-bottom: 40px; }
    .details .left, .details .right { vertical-align: top; display: inline-block; }
    .details .left { width: 60%; }
    .details .right { text-align: right; width: 39%; }
    .details div.section.section__experience>.section__list>.section__list-item { display: flex; flex-direction: column; }
    .details div.section.section__experience>.section__list>.section__list-item .left, 
    .details div.section.section__experience>.section__list>.section__list-item .right { width: 100%; display: flex; flex-direction: row; }
    .details div.section.section__experience>.section__list>.section__list-item .left { justify-content: space-around; }
    .details div.section.section__experience>.section__list>.section__list-item .right { flex-direction: column; text-align: justify; }
    .details .name { font-weight: bold; }
    .details a { text-decoration: none; color: #000; font-style: italic; }
    .details .skills__item { margin-bottom: 10px; }
    .details .skills__item .right input { display: none; }
    .details .skills__item .right label { display: inline-block; width: 15px; height: 15px; background: #C3DEF3; border-radius: 20px; margin-right: 3px; }
    .details .skills__item .right input:checked + label { background: #79A9CE; }
  `;

  const bootstrapThemeCss = `
    .bootstrap-resume { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .bootstrap-resume .card { border: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; margin-bottom: 20px; }
    .bootstrap-resume .card-header { border-radius: 8px 8px 0 0 !important; padding: 12px 20px; background-color: rgba(0,0,0,.03); }
    .bootstrap-resume .card-header h5 { margin: 0; font-weight: 600; }
    .bootstrap-resume .card-body { padding: 20px; }
    .bootstrap-resume .display-4 { font-weight: 700; color: #333; }
    .bootstrap-resume .timeline { position: relative; padding-left: 20px; }
    .bootstrap-resume .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #dee2e6; }
    .bootstrap-resume .timeline > div { position: relative; padding-left: 15px; margin-bottom: 15px; }
    .bootstrap-resume .timeline > div::before { content: ''; position: absolute; left: -23px; top: 5px; width: 8px; height: 8px; border-radius: 50%; background: #0d6efd; }
    .bootstrap-resume .progress { border-radius: 4px; background: #e9ecef; height: 1rem; }
    .bootstrap-resume .badge { font-weight: 500; padding: 5px 10px; }
    @media (max-width: 768px) {
        .bootstrap-resume .display-4 { font-size: 1.8rem; }
        .bootstrap-resume .timeline { padding-left: 15px; }
        .bootstrap-resume .timeline > div::before { left: -18px; }
    }
  `;

  const themeCss = isBootstrap ? bootstrapThemeCss : simpleThemeCss;

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
