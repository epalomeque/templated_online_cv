import React from 'react';
import './resume_actions.scss';

interface ResumeActionsProps {
    title: string;
    email?: string;
}

const ResumeActions: React.FC<ResumeActionsProps> = ({ title, email }) => {
    return (
        <div className="resume-actions-container">
            <h1 className="resume-title">{title}</h1>
            <div className="actions-buttons">
                <a href="/cv.docx" download className="btn btn-doc" title="Descargar DOCX">
                    <i className="fa fa-file-word-o"></i> DOC
                </a>
                <a href="/cv.pdf" download className="btn btn-pdf" title="Descargar PDF">
                    <i className="fa fa-file-pdf-o"></i> PDF
                </a>
                {email && (
                    <a href={`mailto:${email}`} className="btn btn-email" title="Enviar correo">
                        <i className="fa fa-envelope-o"></i> Email
                    </a>
                )}
            </div>
        </div>
    );
};

export default ResumeActions;
