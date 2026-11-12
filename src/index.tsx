/// <reference types="vite/client" />
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

root.render(
<Provider store={store}>
  <App />
</Provider>
);