import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './fonts.css'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@material-tailwind/react";
import { SavedDataProvider } from "./context/SavedDataContext.jsx";

// 


createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <SavedDataProvider>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </SavedDataProvider>
  </StrictMode>,
)
