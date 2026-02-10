import React from 'react';
import './resume_actions.scss';
import CVData from "../../classes/cv_data.ts";
import {getAppSettings} from "../../utilities/getAppSettings.ts";
// import { generateResumeDocx } from '../../utilities/generateDocx.ts';
// import { generateResumePdf } from '../../utilities/generatePdf.ts';

interface ResumeActionsProps {
    title: string;
    cv_data: CVData|never;
}

const ResumeActions: React.FC<ResumeActionsProps> = ({title, cv_data}: ResumeActionsProps) => {
    const app_settings = getAppSettings();
    const emailToUse = cv_data.getFirstEmail();
    return (
        <div className="resume-actions-container">
            <h1 className="resume-title">{ title }</h1>
            <div className="actions-buttons">
                { app_settings.showBtnDoc &&
                    <button
                        // TODO: Implementar generación de DOCX
                        // onClick={() => generateResumeDocx(resumeData)}
                        className="btn btn-doc"
                        title="Descargar DOCX"
                    >
                        <i className="fa fa-file-word-o"></i> DOC
                    </button>
                }
                {
                    app_settings.showBtnPdf &&
                    <button
                        // TODO: Implementar generación de PDF
                        // onClick={() => generateResumePdf(resumeData)}
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
