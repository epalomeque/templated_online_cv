import CVData from '../classes/cv_data';
import { loadTemplates, renderTemplate, ThemeName } from '../services/handlebarsSetup';

const simpleThemeStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
html { height: 100%; }
body { min-height: 100%; background: #eee; font-family: 'Lato', sans-serif; font-weight: 400; color: #222; font-size: 14px; line-height: 26px; padding-bottom: 50px; }
.container { max-width: 700px; background: #fff; margin: 0 auto 0; box-shadow: 1px 1px 2px #DAD7D7; border-radius: 3px; padding: 40px; margin-top: 20px; }
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
.details .section__language .section__list .section__list-item { margin-bottom: auto; }
.details .section__list-item { margin-bottom: 40px; }
.details .section__list-item:last-of-type { margin-bottom: 0; }
.details .left, .details .right { vertical-align: top; display: inline-block; }
.details .left { width: 60%; }
.details .right { text-align: right; width: 39%; }
.details div.section.section__experience > .section__list > .section__list-item { display: flex; flex-direction: column; }
.details div.section.section__experience > .section__list > .section__list-item .left, .details div.section.section__experience > .section__list > .section__list-item .right { width: 100%; display: flex; flex-direction: row; }
.details div.section.section__experience > .section__list > .section__list-item .left { justify-content: space-around; }
.details div.section.section__experience > .section__list > .section__list-item .right { flex-direction: column; text-align: justify; }
.details .name { font-weight: bold; }
.details a { text-decoration: none; color: #000; font-style: italic; }
.details a:hover { text-decoration: underline; color: #000; }
.details .skills__item { margin-bottom: 10px; }
.details .skills__item .right input { display: none; }
.details .skills__item .right label { display: inline-block; width: 15px; height: 15px; background: #C3DEF3; border-radius: 20px; margin-right: 3px; }
.details .skills__item .right input:checked + label { background: #79A9CE; }
`;

const bootstrapThemeStyles = `
.bootstrap-resume { padding: 20px; max-width: 1200px; margin: 0 auto; }
.bootstrap-resume .card { border: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: box-shadow 0.3s ease; }
.bootstrap-resume .card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); }
.bootstrap-resume .card-header { border-radius: 8px 8px 0 0 !important; padding: 12px 20px; }
.bootstrap-resume .card-header h5 { margin: 0; font-weight: 600; }
.bootstrap-resume .card-body { padding: 20px; }
.bootstrap-resume .display-4 { font-weight: 700; color: #333; }
.bootstrap-resume .timeline { position: relative; padding-left: 20px; }
.bootstrap-resume .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #dee2e6; }
.bootstrap-resume .timeline > div { position: relative; padding-left: 15px; }
.bootstrap-resume .timeline > div::before { content: ''; position: absolute; left: -23px; top: 5px; width: 8px; height: 8px; border-radius: 50%; background: #0d6efd; }
.bootstrap-resume .progress { border-radius: 4px; background: #e9ecef; }
.bootstrap-resume .badge { font-weight: 500; padding: 5px 10px; }
.bootstrap-resume .btn-outline-primary:hover { color: #fff; }
.bootstrap-resume .table { margin-bottom: 0; }
.bootstrap-resume .table td { padding: 8px 12px; border-color: #dee2e6; }
`;

const bootstrapMinCss = `
.container-xl { width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 15px; }
.row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
.col-12 { flex: 0 0 100%; max-width: 100%; padding: 0 15px; }
.col-md-6 { flex: 0 0 50%; max-width: 50%; padding: 0 15px; }
@media (max-width: 768px) { .col-md-6 { flex: 0 0 100%; max-width: 100%; } }
.mb-0 { margin-bottom: 0 !important; }
.mb-1 { margin-bottom: 0.25rem !important; }
.mb-2 { margin-bottom: 0.5rem !important; }
.mb-3 { margin-bottom: 1rem !important; }
.mb-4 { margin-bottom: 1.5rem !important; }
.mt-3 { margin-top: 1rem !important; }
.me-2 { margin-right: 0.5rem !important; }
.gap-2 { gap: 0.5rem !important; }
.py-4 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
.d-flex { display: flex !important; }
.flex-wrap { flex-wrap: wrap !important; }
.justify-content-between { justify-content: space-between !important; }
.justify-content-around { justify-content: space-around !important; }
.align-items-start { align-items: flex-start !important; }
.align-items-center { align-items: center !important; }
.text-white { color: #fff !important; }
.text-muted { color: #6c757d !important; }
.text-dark { color: #212529 !important; }
.bg-primary { background-color: #0d6efd !important; }
.bg-success { background-color: #198754 !important; }
.bg-info { background-color: #0dcaf0 !important; }
.bg-warning { background-color: #ffc107 !important; }
.bg-danger { background-color: #dc3545 !important; }
.bg-secondary { background-color: #6c757d !important; }
.bg-dark { background-color: #212529 !important; }
.bg-light { background-color: #f8f9fa !important; }
.bg-white { background-color: #fff !important; }
.lead { font-size: 1.25rem; font-weight: 300; }
.fw-bold { font-weight: 700 !important; }
.display-4 { font-size: 3.5rem; font-weight: 300; line-height: 1.2; }
.card { position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; }
.card-header { padding: 0.75rem 1.25rem; margin-bottom: 0; background-color: rgba(0,0,0,0.03); border-bottom: 1px solid rgba(0,0,0,0.125); }
.card-body { flex: 1 1 auto; padding: 1rem 1rem; }
.btn { display: inline-block; font-weight: 400; line-height: 1.5; color: #212529; text-align: center; text-decoration: none; vertical-align: middle; cursor: pointer; background-color: transparent; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; border-radius: 0.375rem; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.875rem; border-radius: 0.25rem; }
.btn-outline-primary { color: #0d6efd; border-color: #0d6efd; }
.btn-outline-primary:hover { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
.table { width: 100%; margin-bottom: 1rem; color: #212529; }
.table-striped > tbody > tr:nth-of-type(odd) { --bs-table-accent-bg: #f3f3f3; }
.table > tbody > tr > td { padding: 0.75rem; vertical-align: top; border-top: 1px solid #dee2e6; }
.progress { display: flex; height: 1rem; overflow: hidden; background-color: #e9ecef; border-radius: 0.25rem; }
.progress-bar { display: flex; flex-direction: column; justify-content: center; color: #fff; text-align: center; white-space: nowrap; background-color: #0d6efd; transition: width 0.6s ease; }
`;

export function generateHtmlFromCv(
  cvData: CVData,
  theme: ThemeName,
  title: string
): string {
  loadTemplates(theme);
  
  const headerContext = {
    name: cvData.getName() || '',
    lastName: cvData.getLastName() || '',
    email: cvData.getFirstEmail() || '',
    phone: cvData.getCellPhone() || '',
    socialMedia: cvData.getSocialMedia() || [],
    hasAbout: !!(cvData.getAboutTitle() || cvData.getAboutDescription()),
    aboutTitle: cvData.getAboutTitle() || '',
    aboutDescription: cvData.getAboutDescription() || '',
  };

  const sections = [
    { type: 'language', title: 'Languages', items: cvData.getLanguages() || [], hasItems: !!(cvData.getLanguages()?.length) },
    { type: 'experience', title: 'Experience', items: cvData.getExperience() || [], hasItems: !!(cvData.getExperience()?.length) },
    { type: 'education', title: 'Education', items: cvData.getEducation() || [], hasItems: !!(cvData.getEducation()?.length) },
    { type: 'projects', title: 'Projects', items: cvData.getProjects() || [], hasItems: !!(cvData.getProjects()?.length) },
    { type: 'skills', title: 'Skills', items: cvData.getAbilities() || [], hasItems: !!(cvData.getAbilities()?.length) },
    { type: 'interests', title: 'Interests', items: cvData.getInterests() || [], hasItems: !!(cvData.getInterests()?.length) },
  ];

  const headerHtml = renderTemplate(theme, 'header', headerContext);
  
  const sectionsHtml = sections
    .filter(s => s.hasItems)
    .map(section => renderTemplate(theme, section.type, section))
    .join('\n');

  let contentHtml: string;
  let additionalStyles: string;

  if (theme === 'bootstrap') {
    const leftCol = sectionsHtml.split('<div class="card mb-4"').slice(1).filter((_, i) => i % 2 === 0);
    const rightCol = sectionsHtml.split('<div class="card mb-4"').slice(1).filter((_, i) => i % 2 === 1);
    
    const leftHtml = leftCol.map(c => `<div class="card mb-4"${c}`).join('\n');
    const rightHtml = rightCol.map(c => `<div class="card mb-4"${c}`).join('\n');

    contentHtml = `
      <div class="row">
        <div class="col-12 col-md-6">${leftHtml}</div>
        <div class="col-12 col-md-6">${rightHtml}</div>
      </div>
    `;
    additionalStyles = bootstrapMinCss + bootstrapThemeStyles;
  } else {
    contentHtml = `<div class="details">${sectionsHtml}</div>`;
    additionalStyles = simpleThemeStyles;
  }

  const fontLink = theme === 'bootstrap' 
    ? '' 
    : '<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${fontLink}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #eee; font-family: ${theme === 'bootstrap' ? "'system-ui', sans-serif" : "'Lato', sans-serif"}; color: #222; padding: 20px; }
        ${additionalStyles}
    </style>
</head>
<body>
    <div class="${theme === 'bootstrap' ? 'container-xl bootstrap-resume' : 'container'}">
        ${headerHtml}
        ${contentHtml}
    </div>
</body>
</html>`;
}

export function downloadHtml(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
