import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SymptomChecker from './SymptomChecker.jsx';
import './index.css';
import MedicineStudy from './MedicineStudy.jsx';
import Home from './Home.jsx';
import MedicalAI from './MedicalAI.jsx';
import Prescription from './Prescription.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MedicalAI" element={<MedicalAI />} />
        <Route path="/medicine-study" element={<MedicineStudy />} />
        <Route path="/symptom-checker" element={<SymptomChecker/>}/>
        <Route path="/Prescription" element={<Prescription/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);