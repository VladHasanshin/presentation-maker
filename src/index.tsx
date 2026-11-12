/// <reference types="vite/client" />
import './styles/fonts.css';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.js';
import { addEditorChangeHandler, getState, setInitialState } from './editor.js';
import { createTestPresentation } from './data.js';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { setPresentation } from './store/slices/presentationSlice.js';

const initialData = createTestPresentation();
store.dispatch(setPresentation(initialData));
setInitialState(initialData);
const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  const presentation = getState();

  if (!presentation) {
    root.render(<div>Презентация не загружена</div>);
    return;
  }

  root.render(
  <Provider store={store}>
    <App />
  </Provider>
  );
}

renderApp();

addEditorChangeHandler(renderApp);