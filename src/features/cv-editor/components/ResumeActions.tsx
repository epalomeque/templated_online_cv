import React, { useState, useMemo } from 'react';
import './resume_actions.scss';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import CVData from '../../../classes/cv_data';
import {getAppSettings} from '../../../utilities/getAppSettings.ts';
import { generateResumeDocx } from '../../../utilities/generateDocx.ts';
import { generateResumePdf } from '../../../utilities/generatePdf.ts';
import { downloadResumeHtml } from '../../../utilities/generateHtml.ts';
import { stateToJsonFormat, jsonToStateFormat, JsonInput } from '../../../utilities/cvDataConverter.ts';
import { setCVData, setTheme } from '../../../store/cvSlice.ts';
import { themeService } from '../../../services/themeService.ts';
import { ThemeName } from '../../../services/handlebarsSetup.ts';
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

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setTheme(event.target.value as ThemeName));
    };

    const availableThemes = themeService.getAvailableThemes();

    const menuItems = [
        ...(app_settings.showBtnDoc ? [
            {
                id: 'docx-default',
                label: 'Descargar DOCX (Simple)',
                icon: 'fa fa-file-word-o',
                onClick: () => generateResumeDocx(cvData, 'default')
            },
            {
                id: 'docx-visual',
                label: 'Descargar DOCX (Visual)',
                icon: 'fa fa-file-word-o',
                onClick: () => generateResumeDocx(cvData, 'visual')
            }
        ] : []),
        ...(app_settings.showBtnPdf ? [
            {
                id: 'pdf-default',
                label: 'Descargar PDF (Simple)',
                icon: 'fa fa-file-pdf-o',
                onClick: () => generateResumePdf(cvData, 'default')
            },
            {
                id: 'pdf-visual',
                label: 'Descargar PDF (Visual)',
                icon: 'fa fa-file-pdf-o',
                onClick: () => generateResumePdf(cvData, 'visual')
            }
        ] : []),
        {
            id: 'html',
            label: 'Descargar HTML',
            icon: 'fa fa-file-code-o',
            onClick: () => downloadResumeHtml(cvData, theme as any)
        },
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
        <div className="resume-actions-scope">
            <div className="resume-actions-container">
                <h1 className="resume-title">{ title }</h1>
                <div className="actions-wrapper">
                    <div className="theme-selector-container">
                        <i className="fa fa-paint-brush selector-icon"></i>
                        <select 
                            className="theme-selector" 
                            value={theme} 
                            onChange={handleThemeChange}
                            title="Seleccionar tema"
                        >
                            {availableThemes.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>
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
        </div>
    );
};

export default ResumeActions;
