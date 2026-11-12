import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from ".";
import { pushHistory } from "./slices/historySlice";

const EXCLUDED = new Set([
    'presentation/setPresentation',
    'presentation/restorePresentation',
    'presentation/toggleSelectObject',
    'presentation/clearSelection',
    'presentation/setActiveSlide',
    'presentation/setPreviewMode',
])

export const historyMiddleware: Middleware = (store) => (next) => (action) => {
    const type = (action as { type?: string }).type ?? '';
    if (!type.startsWith('presentation/') || EXCLUDED.has(type)) {
        return next(action);
    }

    const before = (store.getState() as RootState).presentation.presentation;
    const result = next(action);
    const after = (store.getState() as RootState).presentation.presentation;

    if (before && after && before !== after) {
        store.dispatch(pushHistory(before))
    }

    return result;
};