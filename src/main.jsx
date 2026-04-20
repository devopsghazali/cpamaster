import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import './index.css'
import App from './App.jsx'

const stored = localStorage.getItem('dw-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (stored === 'dark' || (!stored && prefersDark)) {
  document.documentElement.classList.add('dark')
}

if (typeof window !== 'undefined') {
  posthog.init('phc_vP4rYmhgwBkMWMJEEdk6Vw9FtGNxkKCiPoqjauJm9GNc', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-01-30',
    person_profiles: 'identified_only',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,
      maskInputOptions: { password: true, email: true, tel: true },
    },
  })
  window.posthog = posthog
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
