import { useState, useEffect, useCallback } from 'react';
import { undo, redo, getCanUndo, getCanRedo, addEditorChangeHandler } from '../editor.js'

type HistoryUI = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

// Временные действия должны быть временными и должны обновлять внутренние стейты и диспатч при mouseup
function useHistoryUI(): HistoryUI {
  const [canUndo, setCanUndo] = useState(getCanUndo());
  const [canRedo, setCanRedo] = useState(getCanRedo());

  useEffect(() => {
    const sync = () => {
      setCanUndo(getCanUndo());
      setCanRedo(getCanRedo());
    };
    const unsubscribe = addEditorChangeHandler(sync);
    return () => {
      unsubscribe();
    }
  }, []);

  const onUndo = useCallback(() => {
    undo();
  }, []);

  const onRedo = useCallback(() => {
    redo();
  }, []);
  
  return { canUndo, canRedo, onUndo, onRedo };
}

export {
    useHistoryUI
}
