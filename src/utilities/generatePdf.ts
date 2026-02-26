import jsPDF from 'jspdf';
import CVData from "../classes/cv_data.ts";
import { defaultPdfTemplate, PdfTemplate } from '../features/resume-viewer/templates/pdf-templates/defaultTemplate';
import { visualPdfTemplate } from '../features/resume-viewer/templates/pdf-templates/visualTemplate';

export const pdfTemplates: Record<string, PdfTemplate> = {
    default: defaultPdfTemplate,
    visual: visualPdfTemplate,
};

export const generateResumePdf = (cv_data: CVData, templateId: string = 'default') => {
    if (!cv_data) return;

    const doc = new jsPDF();
    const template = pdfTemplates[templateId] || defaultPdfTemplate;
    
    template.generate(doc, cv_data);

    doc.save("cv.pdf");
};
