import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './theme/tokens.css'
import './theme/light.css'
import './theme/dark.css'
import { router } from './app/router.tsx'

// Set default theme to light
document.documentElement.classList.add('light')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
