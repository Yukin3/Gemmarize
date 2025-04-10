import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

//env vars
const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const redirectUri = window.location.origin


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
      >
      <App />
  </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
)
