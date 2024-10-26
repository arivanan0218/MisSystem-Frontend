import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserRoleProvider } from './Context/UserRoleContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserRoleProvider>
    <App />
    </UserRoleProvider>
  </React.StrictMode>,
)
