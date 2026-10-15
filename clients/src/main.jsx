// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import { AuthProvider } from './context/Authcontext.jsx'
// import { AppContextProvider } from './context/AppContext'
// import { GoogleOAuthProvider } from '@react-oauth/google'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//   <AuthProvider>
//     <AppContextProvider>
//       <App />
//     </AppContextProvider>
//     </AuthProvider>
//   </BrowserRouter>
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/Authcontext.jsx'
import { AppContextProvider } from './context/AppContext'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <AuthProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
