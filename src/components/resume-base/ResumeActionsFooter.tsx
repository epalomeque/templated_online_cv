import React from 'react';
import './resume_actions.scss';

import CVData from "../../classes/cv_data.ts";
import { getCVDataFromJson } from "../../utilities/getinfoData.ts";

interface ResumeActionsFooterProps {
    title: string;
    resumeData: JSON|never;
}

const ResumeActionsFooter: React.FC<ResumeActionsFooterProps> = ({ title, resumeData }: ResumeActionsFooterProps) => {
    console.log('ResumeActionsFooter', resumeData);
    const cvData: CVData = getCVDataFromJson(resumeData);
    console.log('ResumeActionsFooter cvData ->', cvData)
    return (
        <div className="resume-actions-container">
            <h4 className="resume-footer-title">{ title }</h4>
            <h4 className="resume-footer-title">'footer_url'</h4>s
        </div>
    );
};

export default ResumeActionsFooter;