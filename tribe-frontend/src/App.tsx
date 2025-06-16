import { useState } from 'react'

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import { RegistrationForm } from './components/RegistrationForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      {/* This is for home page(lnading page) */}
      <Route path = "/"> </Route> // This is the root path
      <Route path = "/register" element={<RegistrationForm />} />
      <Route path = "/login" element={<LoginForm />} />
      <RegistrationForm />
     </BrowserRouter>
    </AuthProvider>
   

      
    </>
  )
}

export default App
