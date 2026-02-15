import React from 'react';
import './resume_actions.scss';
import { useAppSelector } from '../../store/hooks';
import CVData from '../../classes/cv_data';
import {getAppSettings} from '../../utilities/getAppSettings.ts';
import { generateResumeDocx } from '../../utilities/generateDocx.ts';
import { generateResumePdf } from '../../utilities/generatePdf.ts';

interface ResumeActionsProps {
    title: string;
}

const ResumeActions: React.FC<ResumeActionsProps> = ({ title }: ResumeActionsProps) => {
    const { header } = useAppSelector((state) => state.cv);
    const { details } = useAppSelector((state) => state.cv);
    const cvData = new CVData(header, details);
    
    const app_settings = getAppSettings();
    const emailToUse = cvData.getFirstEmail();

    return (
        <div className="resume-actions-container">
            <h1 className="resume-title">{ title }</h1>
            <div className="actions-buttons">
                { app_settings.showBtnDoc &&
                    <button
                        onClick={() => generateResumeDocx(cvData)}
                        className="btn btn-doc"
                        title="Descargar DOCX"
                    >
                        <i className="fa fa-file-word-o"></i> DOC
                    </button>
                }
                {
                    app_settings.showBtnPdf &&
                    <button
                        onClick={() => generateResumePdf(cvData)}
                        className="btn btn-pdf"
                        title="Descargar PDF"
                    >
                        <i className="fa fa-file-pdf-o"></i> PDF
                    </button>
                }
                {
                    emailToUse && app_settings.showBtnEmail && (
                    <a href={`mailto:${emailToUse}`} className="btn btn-email" title="Enviar correo">
                        <i className="fa fa-envelope-o"></i> Email
                    </a>
                )}
            </div>
        </div>
    );
};

export default ResumeActions;
