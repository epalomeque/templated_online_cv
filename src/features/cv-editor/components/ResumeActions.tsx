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
    const [showHelp, setShowHelp] = useState(false);
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
                    id: 'help',
                    label: '¿Cómo uso esta app?',
                    icon: 'fa fa-question-circle',
                    onClick: () => setShowHelp(true)
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

            {showHelp && (
                <div className="json-editor-scope">
                    <div className="json-editor-overlay" onClick={() => setShowHelp(false)}>
                        <div className="json-editor-modal help-modal" onClick={e => e.stopPropagation()}>
                            <div className="json-editor-header">
                                <h2><i className="fa fa-question-circle"></i> ¿Cómo uso esta app?</h2>
                                <button className="close-btn" onClick={() => setShowHelp(false)} aria-label="Cerrar">
                                    &times;
                                </button>
                            </div>
                            <div className="modal-content-scroll help-content">
                                <div className="help-section">
                                    <h3><i className="fa fa-edit"></i> 1. Edita tu información</h3>
                                    <p>Haz clic en el botón <strong>"Editar CV"</strong> en la parte superior. Puedes elegir entre:</p>
                                    <ul>
                                        <li><strong>Formulario:</strong> Llena tus datos usando campos simples y понятны.</li>
                                        <li><strong>JSON:</strong> Edita directamente el código si sabes cómo usarlo.</li>
                                    </ul>
                                </div>
                                <div className="help-section">
                                    <h3><i className="fa fa-paint-brush"></i> 2. Elige un estilo</h3>
                                    <p>En el menú (☰) selecciona <strong>"Cambiar tema"</strong> para ver diferentes diseños:</p>
                                    <ul>
                                        <li><strong>Simple:</strong> Diseño limpio y profesional</li>
                                        <li><strong>Bootstrap:</strong> Estilo moderno con colores</li>
                                        <li><strong>Dark:</strong> Fondo oscuro elegante</li>
                                    </ul>
                                </div>
                                <div className="help-section">
                                    <h3><i className="fa fa-download"></i> 3. Descarga tu currículum</h3>
                                    <p>En el menú (☰) tienes opciones para guardar:</p>
                                    <ul>
                                        <li><strong>PDF:</strong> Para imprimir o enviar por email</li>
                                        <li><strong>DOCX:</strong> Para editar en Word</li>
                                        <li><strong>HTML:</strong> Página web independiente</li>
                                    </ul>
                                </div>
                                <div className="help-section">
                                    <h3><i className="fa fa-tips"></i> Tips útiles</h3>
                                    <ul>
                                        <li>Usa el <strong>selector de fechas</strong> para indicar cuándo trabajaste o estudiaste</li>
                                        <li>En <strong>habilidades</strong>, ajusta el nivel con el slider (1-10)</li>
                                        <li>En <strong>idiomas</strong>, selecciona tu nivel (Nativo, C2, C1, etc.)</li>
                                        <li>En <strong>intereses</strong>, escribe y presiona Enter para agregar</li>
                                    </ul>
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
