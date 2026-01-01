import jsPDF from 'jspdf';

export const generateResumePdf = (resumeData: never) => {
    if (!resumeData) return;

    const { personal_info, contact_info, about, experience, education, abilities, interests } = resumeData;
    const doc = new jsPDF();

    const primaryColor = [84, 175, 228]; // #54AFE4

    // Header: Name
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    const fullName = `${personal_info.name} ${personal_info.lastname} ${personal_info.second_lastname}`;
    doc.text(fullName, 105, 20, { align: 'center' });

    // Contact Info
    doc.setFontSize(10);
    const email = Array.isArray(contact_info.email) ? contact_info.email[0] : contact_info.email;
    const phone = contact_info.phone_number[0]?.number || '';
    const contactLine = `Email: ${email} | Teléfono: ${phone}`;
    doc.text(contactLine, 105, 30, { align: 'center' });

    const address = `${contact_info.address.city}, ${contact_info.address.state}, ${contact_info.address.country}`;
    doc.text(address, 105, 35, { align: 'center' });

    let currentY = 45;

    // About section
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(about.title.toUpperCase(), 14, currentY);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.line(14, currentY + 2, 196, currentY + 2);
    
    currentY += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const aboutText = doc.splitTextToSize(about.description, 182);
    doc.text(aboutText, 14, currentY);
    currentY += aboutText.length * 5 + 10;

    // Experience section
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("EXPERIENCIA", 14, currentY);
    doc.line(14, currentY + 2, 196, currentY + 2);
    currentY += 10;

    experience.forEach((exp: never) => {
        if (currentY > 260) {
            doc.addPage();
            currentY = 20;
        }
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`${exp.position_name} | ${exp.job_name}`, 14, currentY);
        currentY += 6;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text(`${exp.duration_start} - ${exp.duration_end} | ${exp.addr}`, 14, currentY);
        currentY += 6;
        
        doc.setFont(undefined, 'normal');
        const expDesc = doc.splitTextToSize(exp.pos_description, 182);
        doc.text(expDesc, 14, currentY);
        currentY += expDesc.length * 5 + 8;
    });

    // Education section
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("EDUCACIÓN", 14, currentY);
    doc.line(14, currentY + 2, 196, currentY + 2);
    currentY += 10;

    education.forEach((edu: never) => {
        if (currentY > 260) {
            doc.addPage();
            currentY = 20;
        }
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`${edu.grade_name} | ${edu.institute_name}`, 14, currentY);
        currentY += 6;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text(`${edu.duration_start} - ${edu.duration_end}`, 14, currentY);
        currentY += 6;
        
        doc.setFont(undefined, 'normal');
        const eduDesc = doc.splitTextToSize(edu.pos_description, 182);
        doc.text(eduDesc, 14, currentY);
        currentY += eduDesc.length * 5 + 8;
    });

    // Abilities
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("HABILIDADES", 14, currentY);
    doc.line(14, currentY + 2, 196, currentY + 2);
    currentY += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const skills = abilities.map((a: never) => a.name).join(", ");
    const skillsText = doc.splitTextToSize(skills, 182);
    doc.text(skillsText, 14, currentY);
    currentY += skillsText.length * 5 + 10;

    // Interests
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("INTERESES", 14, currentY);
    doc.line(14, currentY + 2, 196, currentY + 2);
    currentY += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const interestsText = doc.splitTextToSize(interests.join(", "), 182);
    doc.text(interestsText, 14, currentY);

    doc.save("cv.pdf");
};
