import React from 'react';
import { useJsonEditor, JsonValidationResult } from '../../hooks/useJsonEditor';
import './json_editor.scss';

interface JsonEditorProps {
  initialContent: string;
  onUpdate: (parsedData: Record<string, unknown>) => void;
  onClose: () => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ initialContent, onUpdate, onClose }) => {
  const {
    content,
    validation,
    canUndo,
    canRedo,
    setContent,
    undo,
    redo,
    copyToClipboard,
    pasteFromClipboard
  } = useJsonEditor(initialContent);

  const handleUpdate = () => {
    if (validation.isValid) {
      try {
        const parsedData = JSON.parse(content);
        onUpdate(parsedData);
      } catch {
        console.error('Error parsing JSON');
      }
    }
  };

  const renderErrorMessage = (validation: JsonValidationResult) => {
    if (validation.isValid) return null;

    return (
      <div className="json-error-message">
        <span className="error-icon">⚠</span>
        <span className="error-text">{validation.error}</span>
        {validation.errorLine && (
          <span className="error-location">
            (Línea {validation.errorLine}{validation.errorColumn ? `, Columna ${validation.errorColumn}` : ''})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="json-editor-overlay" onClick={onClose}>
      <div className="json-editor-modal" onClick={e => e.stopPropagation()}>
        <div className="json-editor-header">
          <h2>Editar Datos JSON</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>

        <div className="json-editor-toolbar">
          <button 
            className="toolbar-btn" 
            onClick={copyToClipboard} 
            title="Copiar"
            disabled={!content}
          >
            <i className="fa fa-copy"></i> Copiar
          </button>
          <button 
            className="toolbar-btn" 
            onClick={pasteFromClipboard} 
            title="Pegar"
          >
            <i className="fa fa-clipboard"></i> Pegar
          </button>
          <div className="toolbar-divider"></div>
          <button 
            className="toolbar-btn" 
            onClick={undo} 
            disabled={!canUndo}
            title="Deshacer"
          >
            <i className="fa fa-undo"></i> Deshacer
          </button>
          <button 
            className="toolbar-btn" 
            onClick={redo} 
            disabled={!canRedo}
            title="Rehacer"
          >
            <i className="fa fa-redo"></i> Rehacer
          </button>
        </div>

        <div className="json-editor-content">
          <textarea
            className={`json-textarea ${!validation.isValid ? 'has-error' : ''}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Pega tu JSON aquí..."
            spellCheck={false}
          />
          {renderErrorMessage(validation)}
        </div>

        <div className="json-editor-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-update" 
            onClick={handleUpdate}
            disabled={!validation.isValid}
          >
            <i className="fa fa-refresh"></i> Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;
