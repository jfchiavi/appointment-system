import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css' // ✅ Importar CSS primero
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
