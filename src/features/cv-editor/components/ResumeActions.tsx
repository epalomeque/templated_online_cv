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
import CVEditorForm from './CVEditorForm.tsx';
import './cv_editor_form.scss';

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
    const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'json'>('preview');

    const openEditor = (tab: 'edit' | 'json') => {
        const fullData = stateToJsonFormat(header, details);
        setJsonContent(JSON.stringify(fullData, null, 2));
        setIsEditorOpen(true);
        setActiveTab(tab);
    };

    const handleDataUpdate = (parsedData: Record<string, unknown>) => {
        try {
            const { header: newHeader, details: newDetails } = jsonToStateFormat(parsedData as JsonInput);
            dispatch(setCVData({ header: newHeader, details: newDetails }));
            // We don't necessarily close the editor here if we want to stay in the modal
        } catch (err) {
            console.error('Error updating CV data:', err);
        }
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setTheme(event.target.value as ThemeName));
    };

    const availableThemes = themeService.getAvailableThemes();

    const menuItems = [
        ...(emailToUse && app_settings.showBtnEmail ? [{
            id: 'email',
            label: 'Enviar por correo',
            icon: 'fa fa-envelope-o',
            href: `mailto:${emailToUse}`
        }] : []),
        {
            id: 'download-files',
            label: 'Descargar archivos',
            icon: 'fa fa-download',
            children: [
                ...(app_settings.showBtnDoc ? [{
                    id: 'docx-group',
                    label: 'Docx',
                    icon: 'fa fa-file-word-o',
                    children: [
                        {
                            id: 'docx-default',
                            label: 'Tema Simple',
                            icon: 'fa fa-file-text-o',
                            onClick: () => generateResumeDocx(cvData, 'default')
                        },
                        {
                            id: 'docx-visual',
                            label: 'Tema Visual',
                            icon: 'fa fa-file-text-o',
                            onClick: () => generateResumeDocx(cvData, 'visual')
                        }
                    ]
                }] : []),
                ...(app_settings.showBtnPdf ? [{
                    id: 'pdf-group',
                    label: 'PDF',
                    icon: 'fa fa-file-pdf-o',
                    children: [
                        {
                            id: 'pdf-default',
                            label: 'Tema Simple',
                            icon: 'fa fa-file-text-o',
                            onClick: () => generateResumePdf(cvData, 'default')
                        },
                        {
                            id: 'pdf-visual',
                            label: 'Tema Visual',
                            icon: 'fa fa-file-text-o',
                            onClick: () => generateResumePdf(cvData, 'visual')
                        }
                    ]
                }] : []),
                {
                    id: 'html',
                    label: 'HTML',
                    icon: 'fa fa-file-code-o',
                    onClick: () => downloadResumeHtml(cvData, theme as ThemeName)
                }
            ]
        },
        {
            id: 'edit-data-group',
            label: 'Editar Datos',
            icon: 'fa fa-edit',
            children: [
                {
                    id: 'edit-simple',
                    label: 'Modo simple (Formulario)',
                    icon: 'fa fa-wpforms',
                    onClick: () => openEditor('edit')
                },
                {
                    id: 'edit-advanced',
                    label: 'Modo avanzado (JSON)',
                    icon: 'fa fa-code',
                    onClick: () => openEditor('json')
                }
            ]
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
                <div className="json-editor-scope">
                    <div className="json-editor-overlay" onClick={() => setIsEditorOpen(false)}>
                        <div className="json-editor-modal" onClick={e => e.stopPropagation()}>
                            <div className="json-editor-header">
                                <h2>Editor de CV</h2>
                                <button className="close-btn" onClick={() => setIsEditorOpen(false)} aria-label="Cerrar">
                                    &times;
                                </button>
                            </div>
                            
                            <div className="editor-tabs modal-tabs">
                                <button 
                                    className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('edit')}
                                >
                                    <i className="fa fa-edit"></i> Formulario
                                </button>
                                <button 
                                    className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('json')}
                                >
                                    <i className="fa fa-code"></i> JSON
                                </button>
                            </div>

                            <div className="modal-content-scroll">
                                {activeTab === 'edit' ? (
                                    <CVEditorForm />
                                ) : (
                                    <JsonEditor
                                        initialContent={jsonContent}
                                        onUpdate={handleDataUpdate}
                                        onClose={() => setIsEditorOpen(false)}
                                        isEmbedded={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeActions;
