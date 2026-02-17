import React, { useState, useMemo } from 'react';
import './resume_actions.scss';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import CVData from '../../classes/cv_data';
import {getAppSettings} from '../../utilities/getAppSettings.ts';
import { generateResumeDocx } from '../../utilities/generateDocx.ts';
import { generateResumePdf } from '../../utilities/generatePdf.ts';
import { generateHtmlFromCv, downloadHtml } from '../../utilities/generateHtml.ts';
import { stateToJsonFormat, jsonToStateFormat, JsonInput } from '../../utilities/cvDataConverter.ts';
import { setCVData, toggleTheme } from '../../store/cvSlice.ts';
import ActionsMenu from './ActionsMenu.tsx';
import JsonEditor from './JsonEditor.tsx';

interface ResumeActionsProps {
    title: string;
}

const ResumeActions: React.FC<ResumeActionsProps> = ({ title }: ResumeActionsProps) => {
    const dispatch = useAppDispatch();
    const { header, details, theme } = useAppSelector((state) => state.cv);
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

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const handleExportHtml = () => {
        const currentTheme = theme || 'simple';
        const html = generateHtmlFromCv(cvData, currentTheme, title);
        const filename = `cv-${currentTheme}-${new Date().toISOString().split('T')[0]}.html`;
        downloadHtml(html, filename);
    };

    const currentThemeLabel = theme === 'bootstrap' ? 'Simple' : 'Bootstrap';
    const currentThemeIcon = theme === 'bootstrap' ? 'fa fa-file-text' : 'fa fa-bootstrap';

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
            id: 'html',
            label: 'Descargar HTML',
            icon: 'fa fa-html5',
            onClick: handleExportHtml
        },
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
                <div className="actions-wrapper">
                    <button 
                        className="theme-toggle-btn"
                        onClick={handleToggleTheme}
                        title={`Cambiar a tema ${currentThemeLabel}`}
                    >
                        <i className={currentThemeIcon}></i>
                        <span>Tema {currentThemeLabel}</span>
                    </button>
                    <ActionsMenu 
                        items={menuItems}
                        triggerLabel="Acciones"
                        triggerIcon="fa fa-download"
                    />
                </div>
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
