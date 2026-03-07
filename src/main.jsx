import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SymptomChecker from './Predict.jsx';
import './index.css';
import App from './App.jsx';
import SideEffect from './SideEffect.jsx';
import Preventation from './Prevention.jsx';
import MedicineStudy from './MedicineStudy.jsx';
import Home from './home.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summarize" element={<App />} />
        <Route path="/side-effect" element={<SideEffect />} />
        <Route path="/prevention" element={<Preventation />} />
        <Route path="/medicine-study" element={<MedicineStudy />} />
        <Route path="/symptom-checker" element={<SymptomChecker/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);