import React from 'react';
import './resume_actions.scss';
import { generateResumeDocx } from '../../utilities/generateDocx';

interface ResumeActionsProps {
    title: string;
    resumeData: any;
}

const ResumeActions: React.FC<ResumeActionsProps> = ({ title, resumeData }) => {
    const email = resumeData?.contact_info?.email;
    const emailToUse = Array.isArray(email) ? email[0] : email;

    return (
        <div className="resume-actions-container">
            <h1 className="resume-title">{title}</h1>
            <div className="actions-buttons">
                <button 
                    onClick={() => generateResumeDocx(resumeData)} 
                    className="btn btn-doc" 
                    title="Descargar DOCX"
                >
                    <i className="fa fa-file-word-o"></i> DOC
                </button>
                <a href="/cv.pdf" download className="btn btn-pdf" title="Descargar PDF">
                    <i className="fa fa-file-pdf-o"></i> PDF
                </a>
                {emailToUse && (
                    <a href={`mailto:${emailToUse}`} className="btn btn-email" title="Enviar correo">
                        <i className="fa fa-envelope-o"></i> Email
                    </a>
                )}
            </div>
        </div>
    );
};

export default ResumeActions;
