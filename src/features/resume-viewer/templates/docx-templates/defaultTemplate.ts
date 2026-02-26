import {
    AlignmentType,
    BorderStyle,
    HeadingLevel,
    Paragraph,
    TextRun,
    Table,
} from 'docx';
import CVData from '../../../../classes/cv_data';
import ContactInfoInterface from '../../../../interfaces/contact_info';
import SocialMediaInterface from '../../../../interfaces/social_media_info';
import AboutInfoInterface from '../../../../interfaces/about_info';
import LanguagesInterface from '../../../../interfaces/languages_info';
import ExperienceInterface from '../../../../interfaces/experience_info';
import EducationInterface from '../../../../interfaces/education_info';
import AbilitiesInterface from '../../../../interfaces/abilities_info';

export interface DocxTemplate {
    id: string;
    name: string;
    generateChildren: (cv_data: CVData) => (Paragraph | Table)[];
}

export const defaultDocxTemplate: DocxTemplate = {
    id: 'default',
    name: 'Default Template',
    generateChildren: (cv_data: CVData) => {
        const abilities: AbilitiesInterface[] | undefined = cv_data.getAbilities();
        const about: AboutInfoInterface = cv_data.getAboutInfo();
        const contact_info: ContactInfoInterface = cv_data.getContactInfo();
        const education: EducationInterface[] | undefined = cv_data.getEducation();
        const experience: ExperienceInterface[] | undefined = cv_data.getExperience();
        const interests: string[] | undefined = cv_data.getInterests();
        const languages: LanguagesInterface[] | undefined = cv_data.getLanguages();
        const socialMedia: SocialMediaInterface[] | undefined = cv_data.getSocialMedia();

        const primaryColor = "54AFE4";

        const createHeading = (text: string): Paragraph => new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
                new TextRun({
                    text: text.toUpperCase(),
                    bold: true,
                    size: 28,
                    color: primaryColor
                }),
            ],
            border: {
                bottom: {
                    color: "auto",
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 6,
                },
            },
        });

        return [
            // Header: Name
            new Paragraph({
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_1,
                children: [
                    new TextRun({
                        text: `${cv_data.getFullName()}`,
                        bold: true,
                        size: 36,
                    }),
                ],
            }),
            // Contact Info
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `Email: ${Array.isArray(contact_info.email) ? contact_info.email[0] : contact_info.email} | Phone: ${contact_info.phone_number[0]?.number}`,
                        size: 20,
                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `${contact_info.address.city}, ${contact_info.address.state}, ${contact_info.address.country}`,
                        size: 20,
                    }),
                ],
                spacing: { after: 200 },
            }),
            // Social Media
            ...(socialMedia ?? []).flatMap((a: SocialMediaInterface) => [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: `${a.platform}: ${a.url}`, size: 20 }),
                    ],
                    spacing: { after: 200 },
                })
            ]),

            // About section
            createHeading(about.title),
            new Paragraph({
                children: [
                    new TextRun({
                        text: about.description,
                        size: 24,
                    }),
                ],
                spacing: { after: 300, before: 100 },
            }),

            // Languages Section
            createHeading("LANGUAGES"),
            new Paragraph({
                spacing: { after: 300, before: 100 },
                children: [
                    new TextRun({
                        text: languages?.map((a: LanguagesInterface) => `${a.name}: ${a.level}`).join(" | ") ?? '',
                        size: 22,
                    }),
                ],
            }),

            // Experience section
            createHeading("EXPERIENCE"),
            ...(experience ?? []).flatMap((exp: ExperienceInterface) => [
                new Paragraph({
                    spacing: { before: 200 },
                    children: [
                        new TextRun({ text: exp.position_name, bold: true, size: 24 }),
                        new TextRun({ text: ` | ${exp.job_name}`, size: 24 }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `${exp.duration_start} - ${exp.duration_end}`, italics: true, size: 20 }),
                        new TextRun({ text: ` | ${exp.addr}`, size: 20 }),
                    ],
                }),
                new Paragraph({
                    children: [new TextRun({ text: exp.pos_description, size: 22 })],
                    spacing: { after: 200 },
                }),
            ]),

            // Education section
            createHeading("EDUCATION"),
            ...(education ?? []).flatMap((edu: EducationInterface) => [
                new Paragraph({
                    spacing: { before: 200 },
                    children: [
                        new TextRun({ text: edu.grade_name, bold: true, size: 24 }),
                        new TextRun({ text: ` | ${edu.institute_name}`, size: 24 }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `${edu.duration_start} - ${edu.duration_end}`, italics: true, size: 20 }),
                    ],
                }),
                new Paragraph({
                    children: [new TextRun({ text: edu.pos_description, size: 22 })],
                    spacing: { after: 200 },
                }),
            ]),

            // Abilities
            createHeading("SKILLS"),
            new Paragraph({
                spacing: { before: 200 },
                children: [
                    new TextRun({
                        text: abilities?.map((a: AbilitiesInterface) => a.name).join(", ") ?? '',
                        size: 22,
                    }),
                ],
            }),

            // Interests
            createHeading("INTERESTS"),
            new Paragraph({
                spacing: { before: 200 },
                children: [
                    new TextRun({
                        text: interests?.join(", ") ?? '',
                        size: 22,
                    }),
                ],
            }),
        ];
    }
};
