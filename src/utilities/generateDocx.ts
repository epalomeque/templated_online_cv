import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export const generateResumeDocx = async (resumeData: any) => {
    if (!resumeData) return;

    const { personal_info, contact_info, about, experience, education, abilities, interests } = resumeData;

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Header: Name
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: `${personal_info.name} ${personal_info.lastname} ${personal_info.second_lastname}`,
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

                    // About section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [
                            new TextRun({
                                text: about.title,
                                bold: true,
                                size: 28,
                                color: "54AFE4"
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
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: about.description,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 300, before: 100 },
                    }),

                    // Experience section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 28, color: "54AFE4" })],
                        border: {
                            bottom: {
                                color: "auto",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 6,
                            },
                        },
                    }),
                    ...experience.flatMap((exp: any) => [
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
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [new TextRun({ text: "EDUCATION", bold: true, size: 28, color: "54AFE4" })],
                        border: {
                            bottom: {
                                color: "auto",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 6,
                            },
                        },
                    }),
                    ...education.flatMap((edu: any) => [
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
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [new TextRun({ text: "SKILLS", bold: true, size: 28, color: "54AFE4" })],
                        border: {
                            bottom: {
                                color: "auto",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 6,
                            },
                        },
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        children: [
                            new TextRun({
                                text: abilities.map((a: any) => a.name).join(", "),
                                size: 22,
                            }),
                        ],
                    }),

                    // Interests
                    new Paragraph({
                        spacing: { before: 400 },
                        heading: HeadingLevel.HEADING_2,
                        children: [new TextRun({ text: "INTERESTS", bold: true, size: 28, color: "54AFE4" })],
                        border: {
                            bottom: {
                                color: "auto",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 6,
                            },
                        },
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        children: [
                            new TextRun({
                                text: interests.join(", "),
                                size: 22,
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "cv.docx");
};
