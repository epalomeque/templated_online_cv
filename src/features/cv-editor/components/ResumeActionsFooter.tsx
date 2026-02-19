import React from 'react';
import './resume_actions.scss';
import { getAppSettings } from "../../../utilities/getAppSettings.ts";

interface ResumeActionsFooterProps {
    title: string;
}

const ResumeActionsFooter: React.FC<ResumeActionsFooterProps> = () => {
    const app_settings = getAppSettings();
    return (
        <div className="resume-actions-scope">
            <div className="resume-actions-footer-container">
                <h4 className="resume-footer-url"><a href={ app_settings.githubHostedUrl }>Repositorio en Github</a> | <a href='https://epalomeque.net'>epalomeque.net</a> </h4>
            </div>
        </div>
    );
};

export default ResumeActionsFooter;