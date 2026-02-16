import { useState, useCallback, useRef } from 'react';

export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

interface HistoryEntry {
  content: string;
  timestamp: number;
}

interface UseJsonEditorReturn {
  content: string;
  validation: JsonValidationResult;
  canUndo: boolean;
  canRedo: boolean;
  setContent: (content: string) => void;
  undo: () => void;
  redo: () => void;
  copyToClipboard: () => Promise<void>;
  pasteFromClipboard: () => Promise<void>;
  validateJson: (content: string) => JsonValidationResult;
}

const MAX_HISTORY_SIZE = 50;

export function useJsonEditor(initialContent: string): UseJsonEditorReturn {
  const [content, setContentState] = useState(initialContent);
  const [validation, setValidation] = useState<JsonValidationResult>({ isValid: true });
  const [history, setHistory] = useState<HistoryEntry[]>([{ content: initialContent, timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const isUndoRedoAction = useRef(false);

  const validateJson = useCallback((jsonString: string): JsonValidationResult => {
    if (!jsonString.trim()) {
      return { isValid: false, error: 'El JSON no puede estar vacío' };
    }

    try {
      JSON.parse(jsonString);
      return { isValid: true };
    } catch (e) {
      const error = e as SyntaxError;
      const match = error.message.match(/position (\d+)/);
      
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        return {
          isValid: false,
          error: `Error de sintaxis: ${error.message}`,
          errorLine: line,
          errorColumn: column
        };
      }
      
      return { isValid: false, error: `Error de sintaxis: ${error.message}` };
    }
  }, []);

  const pushToHistory = useCallback((newContent: string) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ content: newContent, timestamp: Date.now() });
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [historyIndex]);

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
    const result = validateJson(newContent);
    setValidation(result);
    pushToHistory(newContent);
  }, [validateJson, pushToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const entry = history[newIndex];
      setContentState(entry.content);
      setValidation(validateJson(entry.content));
    }
  }, [historyIndex, history, validateJson]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const entry = history[newIndex];
      setContentState(entry.content);
      setValidation(validateJson(entry.content));
    }
  }, [historyIndex, history, validateJson]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }, [setContent]);

  return {
    content,
    validation,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setContent,
    undo,
    redo,
    copyToClipboard,
    pasteFromClipboard,
    validateJson
  };
}
