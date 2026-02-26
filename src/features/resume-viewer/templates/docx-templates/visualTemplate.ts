import {
    AlignmentType,
    BorderStyle,
    HeadingLevel,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    VerticalAlign,
} from 'docx';
import CVData from '../../../../classes/cv_data';
import ContactInfoInterface from '../../../../interfaces/contact_info';
import SocialMediaInterface from '../../../../interfaces/social_media_info';
import AboutInfoInterface from '../../../../interfaces/about_info';
import LanguagesInterface from '../../../../interfaces/languages_info';
import ExperienceInterface from '../../../../interfaces/experience_info';
import EducationInterface from '../../../../interfaces/education_info';
import AbilitiesInterface from '../../../../interfaces/abilities_info';
import { DocxTemplate } from './defaultTemplate';

export const visualDocxTemplate: DocxTemplate = {
    id: 'visual',
    name: 'Visual Template',
    generateChildren: (cv_data: CVData): (Paragraph | Table)[] => {
        const abilities: AbilitiesInterface[] | undefined = cv_data.getAbilities();
        const about: AboutInfoInterface = cv_data.getAboutInfo();
        const contact_info: ContactInfoInterface = cv_data.getContactInfo();
        const education: EducationInterface[] | undefined = cv_data.getEducation();
        const experience: ExperienceInterface[] | undefined = cv_data.getExperience();
        const interests: string[] | undefined = cv_data.getInterests();
        const languages: LanguagesInterface[] | undefined = cv_data.getLanguages();
        const socialMedia: SocialMediaInterface[] | undefined = cv_data.getSocialMedia();

        const primaryColor = "2C3E50";
        const accentColor = "E74C3C";

        const createSectionHeading = (text: string): Paragraph => new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
                new TextRun({
                    text: text.toUpperCase(),
                    bold: true,
                    size: 24,
                    color: accentColor,
                    font: "Calibri",
                }),
            ],
            border: {
                bottom: {
                    color: accentColor,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 12,
                },
            },
            spacing: { before: 400, after: 200 },
        });

        return [
            // Header Table for a "Visual" look
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: cv_data.getFullName(),
                                                bold: true,
                                                size: 48,
                                                color: primaryColor,
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: about.title || "Professional",
                                                size: 28,
                                                color: "7F8C8D",
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                ],
                                width: { size: 70, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({
                                                text: Array.isArray(contact_info.email) ? contact_info.email[0] : contact_info.email,
                                                size: 18,
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({
                                                text: contact_info.phone_number[0]?.number || "",
                                                size: 18,
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({
                                                text: `${contact_info.address.city}, ${contact_info.address.country}`,
                                                size: 18,
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                ],
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                        ],
                    }),
                ],
            }),

            // Summary
            createSectionHeading("Summary"),
            new Paragraph({
                children: [
                    new TextRun({
                        text: about.description,
                        size: 22,
                        font: "Calibri",
                    }),
                ],
                spacing: { after: 200 },
            }),

            // Experience
            createSectionHeading("Experience"),
            ...(experience ?? []).flatMap((exp: ExperienceInterface) => [
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.position_name, bold: true, size: 24, font: "Calibri" }),
                        new TextRun({ text: ` at ${exp.job_name}`, size: 24, font: "Calibri" }),
                    ],
                    spacing: { before: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `${exp.duration_start} - ${exp.duration_end} | ${exp.addr}`, italics: true, size: 18, color: "7F8C8D", font: "Calibri" }),
                    ],
                }),
                new Paragraph({
                    children: [new TextRun({ text: exp.pos_description, size: 20, font: "Calibri" })],
                    spacing: { after: 100 },
                }),
            ]),

            // Skills & Languages (Two columns)
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    createSectionHeading("Skills"),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: abilities?.map((a: AbilitiesInterface) => a.name).join(", ") ?? '',
                                                size: 20,
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                ],
                                width: { size: 50, type: WidthType.PERCENTAGE },
                            }),
                            new TableCell({
                                children: [
                                    createSectionHeading("Languages"),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: languages?.map((a: LanguagesInterface) => `${a.name} (${a.level})`).join(", ") ?? '',
                                                size: 20,
                                                font: "Calibri",
                                            }),
                                        ],
                                    }),
                                ],
                                width: { size: 50, type: WidthType.PERCENTAGE },
                            }),
                        ],
                    }),
                ],
            }),

            // Social Media
            createSectionHeading("Social Media"),
            new Paragraph({
                children: (socialMedia ?? []).flatMap((a: SocialMediaInterface, index: number) => [
                    new TextRun({
                        text: `${a.platform}: ${a.url}`,
                        size: 20,
                        font: "Calibri",
                    }),
                    ...(index < (socialMedia?.length ?? 0) - 1 ? [new TextRun({ text: " | ", size: 20, font: "Calibri" })] : []),
                ]),
                spacing: { after: 200 },
            }),

            // Education
            createSectionHeading("Education"),
            ...(education ?? []).flatMap((edu: EducationInterface) => [
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.grade_name, bold: true, size: 24, font: "Calibri" }),
                        new TextRun({ text: ` - ${edu.institute_name}`, size: 24, font: "Calibri" }),
                    ],
                    spacing: { before: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `${edu.duration_start} - ${edu.duration_end}`, italics: true, size: 18, color: "7F8C8D", font: "Calibri" }),
                    ],
                }),
            ]),

            // Interests
            createSectionHeading("Interests"),
            new Paragraph({
                children: [
                    new TextRun({
                        text: interests?.join(", ") ?? '',
                        size: 20,
                        font: "Calibri",
                    }),
                ],
            }),
        ];
    }
};
