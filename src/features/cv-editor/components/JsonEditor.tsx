import React, { useRef } from 'react';
import { useJsonEditor, JsonValidationResult } from '../../../hooks/useJsonEditor';
import './json_editor.scss';

interface JsonEditorProps {
  initialContent: string;
  onUpdate: (parsedData: Record<string, unknown>) => void;
  onClose: () => void;
  isEmbedded?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ initialContent, onUpdate, onClose, isEmbedded = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadJson = () => {
    if (!content) return;
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

  const contentBody = (
    <div className={`json-editor-modal ${isEmbedded ? 'embedded' : ''}`} onClick={e => e.stopPropagation()}>
      {!isEmbedded && (
        <div className="json-editor-header">
          <h2>Editar Datos JSON</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
      )}

      <div className="json-editor-toolbar">
        <button 
          className="toolbar-btn" 
          onClick={() => fileInputRef.current?.click()} 
          title="Cargar archivo JSON"
        >
          <i className="fa fa-folder-open"></i> Cargar
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
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
        <button 
          className="toolbar-btn" 
          onClick={downloadJson} 
          title="Descargar archivo JSON"
          disabled={!content || !validation.isValid}
        >
          <i className="fa fa-download"></i> Descargar
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
  );

  if (isEmbedded) {
    return <div className="json-editor-scope embedded">{contentBody}</div>;
  }

  return (
    <div className="json-editor-scope">
      <div className="json-editor-overlay" onClick={onClose}>
        {contentBody}
      </div>
    </div>
  );
};

export default JsonEditor;
