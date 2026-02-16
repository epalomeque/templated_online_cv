import React, { useState, useMemo } from 'react';
import './resume_actions.scss';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import CVData from '../../classes/cv_data';
import {getAppSettings} from '../../utilities/getAppSettings.ts';
import { generateResumeDocx } from '../../utilities/generateDocx.ts';
import { generateResumePdf } from '../../utilities/generatePdf.ts';
import { stateToJsonFormat, jsonToStateFormat, JsonInput } from '../../utilities/cvDataConverter.ts';
import { setCVData } from '../../store/cvSlice.ts';
import ActionsMenu from './ActionsMenu.tsx';
import JsonEditor from './JsonEditor.tsx';

interface ResumeActionsProps {
    title: string;
}

const ResumeActions: React.FC<ResumeActionsProps> = ({ title }: ResumeActionsProps) => {
    const dispatch = useAppDispatch();
    const { header, details } = useAppSelector((state) => state.cv);
    const cvData = useMemo(() => new CVData(header, details), [header, details]);
    
    const app_settings = getAppSettings();
    const emailToUse = cvData.getFirstEmail();

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [jsonContent, setJsonContent] = useState('');

    const openJsonEditor = () => {
        const fullData = stateToJsonFormat(header, details);
        setJsonContent(JSON.stringify(fullData, null, 2));
        setIsEditorOpen(true);
    };

    const handleJsonUpdate = (parsedData: Record<string, unknown>) => {
        try {
            const { header: newHeader, details: newDetails } = jsonToStateFormat(parsedData as JsonInput);
            dispatch(setCVData({ header: newHeader, details: newDetails }));
            setIsEditorOpen(false);
        } catch (err) {
            console.error('Error updating CV data:', err);
        }
    };

    const menuItems = [
        ...(app_settings.showBtnDoc ? [{
            id: 'docx',
            label: 'Descargar DOCX',
            icon: 'fa fa-file-word-o',
            onClick: () => generateResumeDocx(cvData)
        }] : []),
        ...(app_settings.showBtnPdf ? [{
            id: 'pdf',
            label: 'Descargar PDF',
            icon: 'fa fa-file-pdf-o',
            onClick: () => generateResumePdf(cvData)
        }] : []),
        ...(emailToUse && app_settings.showBtnEmail ? [{
            id: 'email',
            label: 'Enviar por email',
            icon: 'fa fa-envelope-o',
            href: `mailto:${emailToUse}`
        }] : []),
        {
            id: 'edit-json',
            label: 'Editar JSON',
            icon: 'fa fa-code',
            onClick: openJsonEditor
        }
    ];

    return (
        <>
            <div className="resume-actions-container">
                <h1 className="resume-title">{ title }</h1>
                <ActionsMenu 
                    items={menuItems}
                    triggerLabel="Acciones"
                    triggerIcon="fa fa-download"
                />
            </div>
            {isEditorOpen && (
                <JsonEditor
                    initialContent={jsonContent}
                    onUpdate={handleJsonUpdate}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </>
    );
};

export default ResumeActions;
