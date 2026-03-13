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
    const [isHelpOpen, setIsHelpOpen] = useState(false);

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

    const availableThemes = themeService.getAvailableThemes();

    const menuItems = [
        ...(app_settings.showBtnDoc || app_settings.showBtnPdf ? [{
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
        }] : []),
        {
            id: 'theme-group',
            label: 'Cambiar tema',
            icon: 'fa fa-paint-brush',
            children: availableThemes.map(t => ({
                id: `theme-${t.id}`,
                label: t.label,
                icon: theme === t.id ? 'fa fa-check-square-o' : 'fa fa-square-o',
                onClick: () => dispatch(setTheme(t.id as ThemeName))
            }))
        },
        ...(emailToUse && app_settings.showBtnEmail ? [{
            id: 'email',
            label: 'Enviar por correo',
            icon: 'fa fa-envelope-o',
            href: `mailto:${emailToUse}`
        }] : []),
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
        },
        {
            id: 'how-to-use',
            label: '¿Cómo uso esta app?',
            icon: 'fa fa-question-circle',
            onClick: () => setIsHelpOpen(true)
        }
    ];

    return (
        <div className="resume-actions-scope">
            <div className="resume-actions-container">
                <h1 className="resume-title">{ title }</h1>
                <div className="actions-wrapper">
                    <button 
                        className="edit-cv-btn"
                        onClick={() => openEditor('edit')}
                        title="Editar datos del CV"
                    >
                        <i className="fa fa-edit"></i> Editar CV
                    </button>
                    <ActionsMenu 
                        items={menuItems}
                        triggerIcon="fa fa-bars"
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

            {isHelpOpen && (
                <div className="json-editor-scope">
                    <div className="json-editor-overlay" onClick={() => setIsHelpOpen(false)}>
                        <div className="json-editor-modal" onClick={e => e.stopPropagation()}>
                            <div className="json-editor-header">
                                <h2>¿Cómo uso esta app?</h2>
                                <button className="close-btn" onClick={() => setIsHelpOpen(false)} aria-label="Cerrar">
                                    &times;
                                </button>
                            </div>
                            <div className="modal-content-scroll help-content">
                                <div className="help-section">
                                    <h3><i className="fa fa-edit"></i> Editar tu CV</h3>
                                    <p>Puedes modificar los datos de tu currículum de dos formas:</p>
                                    <ul>
                                        <li><strong>Modo Formulario:</strong> Rellena los campos uno por uno de forma sencilla.</li>
                                        <li><strong>Modo JSON:</strong> Edita los datos directamente en formato JSON (para usuarios avanzados).</li>
                                    </ul>
                                </div>
                                <div className="help-section">
                                    <h3><i className="fa fa-paint-brush"></i> Cambiar el diseño</h3>
                                    <p>En el menú (tres líneas) puedes elegir entre diferentes temas visuales como Simple, Bootstrap o Tema Oscuro.</p>
                                </div>
                                <div className="help-section">
                                    <h3><i className="fa fa-download"></i> Descargar tu CV</h3>
                                    <p>Desde el menú puedes guardar tu currículum en diferentes formatos:</p>
                                    <ul>
                                        <li><strong>PDF:</strong> Ideal para enviar por email o imprimir.</li>
                                        <li><strong>Word (DOCX):</strong> Para que otras personas puedan editarlo.</li>
                                        <li><strong>HTML:</strong> Una página web independiente que puedes subir a internet.</li>
                                    </ul>
                                </div>
                                <div className="help-section">
                                    <h3><i className="fa fa-floppy-o"></i> Guardar cambios</h3>
                                    <p>Los cambios que haces se guardan en el navegador. Para conservarlos, descarga el archivo JSON desde el editor o exporta tu CV en el formato que prefieras.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeActions;
