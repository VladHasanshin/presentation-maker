import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getCanUndo, getCanRedo } from '@/store/selectors';
import { undo, redo } from '@/store/slices/historySlice';
import { useSelector } from 'react-redux';

type HistoryUI = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

function useHistoryUI(): HistoryUI {
  const dispatch = useAppDispatch();
  const canUndo = useSelector(getCanUndo);
  const canRedo = useSelector(getCanRedo);

  const onUndo = useCallback(() => dispatch(undo()), []);
  const onRedo = useCallback(() => dispatch(redo()), []);
  
  return { canUndo, canRedo, onUndo, onRedo };
}

export {
    useHistoryUI
}