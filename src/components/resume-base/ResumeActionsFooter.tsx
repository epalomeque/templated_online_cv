import React from 'react';
import './resume_actions.scss';
import { getAppSettings } from "../../utilities/getAppSettings.ts";

interface ResumeActionsFooterProps {
    title: string;
}

const ResumeActionsFooter: React.FC<ResumeActionsFooterProps> = () => {
    const app_settings = getAppSettings();
    return (
        <div className="resume-actions-footer-container">
            <h4 className="resume-footer-url">Github: { app_settings.githubHostedUrl }</h4>
        </div>
    );
};

export default ResumeActionsFooter;