import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const stored = localStorage.getItem('dw-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (stored === 'dark' || (!stored && prefersDark)) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
