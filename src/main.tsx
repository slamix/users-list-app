import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { Provider } from 'react-redux'
import state from './slices/index.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={state}>
    <StrictMode>
      <BrowserRouter>
        <CssBaseline />
        <GlobalStyles styles={{ html: { scrollbarGutter: 'stable' }, body: { scrollbarGutter: 'stable' } }} />
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>,
);
