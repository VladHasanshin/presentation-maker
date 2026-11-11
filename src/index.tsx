/// <reference types="vite/client" />
import './styles/fonts.css';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.js';
import { addEditorChangeHandler, getState, setInitialState } from './editor.js';
import { createTestPresentation } from './data.js';

const initialData = createTestPresentation();
setInitialState(initialData);
const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  const presentation = getState();

  if (!presentation) {
    root.render(<div>Презентация не загружена</div>);
    return;
  }

  root.render(<App presentation={presentation} />);
}

renderApp();

addEditorChangeHandler(renderApp);