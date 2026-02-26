import jsPDF from 'jspdf';
import CVData from '../../../../classes/cv_data';
import AbilitiesInterface from '../../../../interfaces/abilities_info';
import AboutInfoInterface from '../../../../interfaces/about_info';
import ContactInfoInterface from '../../../../interfaces/contact_info';
import EducationInterface from '../../../../interfaces/education_info';
import ExperienceInterface from '../../../../interfaces/experience_info';
import SocialMediaInterface from '../../../../interfaces/social_media_info';
import { PdfTemplate } from './defaultTemplate';

export const visualPdfTemplate: PdfTemplate = {
    id: 'visual',
    name: 'Visual Template',
    generate: (doc: jsPDF, cv_data: CVData) => {
        const abilities: AbilitiesInterface[] | undefined = cv_data.getAbilities();
        const about: AboutInfoInterface = cv_data.getAboutInfo();
        const contact_info: ContactInfoInterface = cv_data.getContactInfo();
        const education: EducationInterface[] | undefined = cv_data.getEducation();
        const experience: ExperienceInterface[] | undefined = cv_data.getExperience();
        const interests: string[] | undefined = cv_data.getInterests();
        const socialMedia: SocialMediaInterface[] | undefined = cv_data.getSocialMedia();

        const primaryColor = [44, 62, 80]; // #2C3E50
        const accentColor = [231, 76, 60]; // #E74C3C
        const textColor = [52, 73, 94]; // #34495E
        const lightTextColor = [127, 140, 141]; // #7F8C8D

        // Sidebar Background
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 70, 297, 'F');

        // Sidebar Content
        let sidebarY = 20;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        const nameParts = cv_data.getFullName().split(' ');
        nameParts.forEach(part => {
            doc.text(part.toUpperCase(), 35, sidebarY, { align: 'center' });
            sidebarY += 10;
        });

        sidebarY += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const email = Array.isArray(contact_info.email) ? contact_info.email[0] : contact_info.email;
        const phone = contact_info.phone_number[0]?.number || '';
        
        doc.text("CONTACT", 35, sidebarY, { align: 'center' });
        sidebarY += 5;
        doc.setDrawColor(255, 255, 255);
        doc.line(15, sidebarY, 55, sidebarY);
        sidebarY += 8;

        doc.setFontSize(9);
        const emailLines = doc.splitTextToSize(email, 60);
        doc.text(emailLines, 35, sidebarY, { align: 'center' });
        sidebarY += emailLines.length * 5 + 2;
        
        doc.text(phone, 35, sidebarY, { align: 'center' });
        sidebarY += 7;
        
        const address = `${contact_info.address.city}, ${contact_info.address.country}`;
        const addressLines = doc.splitTextToSize(address, 60);
        doc.text(addressLines, 35, sidebarY, { align: 'center' });
        sidebarY += addressLines.length * 5 + 8;

        // Social Media in Sidebar
        if (socialMedia && socialMedia.length > 0) {
            doc.setFontSize(10);
            doc.text("SOCIAL", 35, sidebarY, { align: 'center' });
            sidebarY += 5;
            doc.line(15, sidebarY, 55, sidebarY);
            sidebarY += 8;
            
            doc.setFontSize(8);
            socialMedia.forEach(sm => {
                const text = `${sm.platform}: ${sm.url}`;
                const lines = doc.splitTextToSize(text, 60);
                doc.text(lines, 35, sidebarY, { align: 'center' });
                sidebarY += lines.length * 5;
            });
            sidebarY += 5;
        }

        // Skills in Sidebar
        doc.setFontSize(10);
        doc.text("SKILLS", 35, sidebarY, { align: 'center' });
        sidebarY += 5;
        doc.line(15, sidebarY, 55, sidebarY);
        sidebarY += 8;
        
        doc.setFontSize(9);
        abilities?.forEach(skill => {
            doc.text(skill.name, 35, sidebarY, { align: 'center' });
            sidebarY += 5;
        });

        // Interests in Sidebar
        if (interests && interests.length > 0) {
            sidebarY += 10;
            doc.setFontSize(10);
            doc.text("INTERESTS", 35, sidebarY, { align: 'center' });
            sidebarY += 5;
            doc.line(15, sidebarY, 55, sidebarY);
            sidebarY += 8;
            
            doc.setFontSize(9);
            interests.forEach(interest => {
                const lines = doc.splitTextToSize(interest, 60);
                doc.text(lines, 35, sidebarY, { align: 'center' });
                sidebarY += lines.length * 5;
            });
        }

        // Main Content
        let mainY = 20;
        const mainX = 80;
        const mainWidth = 115;

        const createMainHeading = (text: string) => {
            if (mainY > 260) {
                doc.addPage();
                // Redraw sidebar on new page? Maybe just keep it simple for now.
                mainY = 20;
            }
            doc.setFontSize(14);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(text.toUpperCase(), mainX, mainY);
            mainY += 2;
            doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.line(mainX, mainY, mainX + mainWidth, mainY);
            mainY += 8;
        };

        // Profile
        createMainHeading("Profile");
        doc.setFontSize(10);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFont('helvetica', 'normal');
        const profileText = doc.splitTextToSize(about.description, mainWidth);
        doc.text(profileText, mainX, mainY);
        mainY += profileText.length * 5 + 10;

        // Experience
        createMainHeading("Experience");
        experience?.forEach(exp => {
            if (mainY > 250) {
                doc.addPage();
                mainY = 20;
            }
            doc.setFontSize(11);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(exp.position_name, mainX, mainY);
            
            doc.setFontSize(10);
            doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
            doc.setFont('helvetica', 'italic');
            const dateStr = `${exp.duration_start} - ${exp.duration_end}`;
            doc.text(dateStr, mainX + mainWidth, mainY, { align: 'right' });
            mainY += 5;

            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(exp.job_name, mainX, mainY);
            mainY += 5;

            doc.setFont('helvetica', 'normal');
            const desc = doc.splitTextToSize(exp.pos_description, mainWidth);
            doc.text(desc, mainX, mainY);
            mainY += desc.length * 5 + 8;
        });

        // Education
        createMainHeading("Education");
        education?.forEach(edu => {
            if (mainY > 260) {
                doc.addPage();
                mainY = 20;
            }
            doc.setFontSize(11);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(edu.grade_name, mainX, mainY);
            mainY += 5;

            doc.setFontSize(10);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.setFont('helvetica', 'normal');
            doc.text(edu.institute_name, mainX, mainY);
            
            doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
            doc.setFont('helvetica', 'italic');
            doc.text(`${edu.duration_start} - ${edu.duration_end}`, mainX + mainWidth, mainY, { align: 'right' });
            mainY += 10;
        });
    }
};
