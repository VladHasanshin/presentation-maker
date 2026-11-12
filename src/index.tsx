/// <reference types="vite/client" />
import type { RootState } from './store/index.js';
import './styles/fonts.css';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.js';
import { createTestPresentation } from './data.js';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/index.js';
import { setPresentation } from './store/slices/presentationSlice.js';

const initialData = createTestPresentation();
store.dispatch(setPresentation(initialData));
const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  const presentation = useSelector((state: RootState) => state.presentation.presentation);

  if (!presentation) {
    root.render(<div>Презентация не загружена</div>);
    return
  }

  root.render(
  <Provider store={store}>
    <App />
  </Provider>
  );
}

renderApp();