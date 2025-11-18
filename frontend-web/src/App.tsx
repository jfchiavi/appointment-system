// src/App.tsx
//import React from 'react'; TODO: revisar por que no se usa React aquí
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppointmentProvider } from './contexts/AppointmentContext.tsx';
import { Home } from './pages/Home.tsx';
import { AppointmentFlow } from './components/appointment/AppointmentFlow.tsx';
import { AppointmentConfirmation } from './pages/AppointmentConfirmation.tsx';
import { NotFound } from './pages/NotFound.tsx';
// import './styles/index.css';

function App() {
  return (
    <AppointmentProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reservar" element={<AppointmentFlow />} />
            <Route path="/appointment-confirmation/:id" element={<AppointmentConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AppointmentProvider>
  );
}

export default App;