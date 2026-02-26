import {
    Document,
    Packer,
} from 'docx';
import { saveAs } from 'file-saver';
import CVData from "../classes/cv_data.ts";
import { defaultDocxTemplate, DocxTemplate } from '../features/resume-viewer/templates/docx-templates/defaultTemplate';
import { visualDocxTemplate } from '../features/resume-viewer/templates/docx-templates/visualTemplate';

export const docxTemplates: Record<string, DocxTemplate> = {
    default: defaultDocxTemplate,
    visual: visualDocxTemplate,
};

export const generateResumeDocx = async (cv_data: CVData, templateId: string = 'default') => {
    if (!cv_data) return;

    const template = docxTemplates[templateId] || defaultDocxTemplate;
    const children = template.generateChildren(cv_data);

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                    },
                },
            },
        },
        sections: [
            {
                properties: {},
                children: children,
            },
        ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "cv.docx");
};
