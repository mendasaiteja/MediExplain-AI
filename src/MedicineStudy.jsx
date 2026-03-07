import React, { useState } from 'react';
import './MedicineStudy.css';

const MedicineStudy = () => {
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const [conceptsOutput, setConceptsOutput] = useState('Medical concepts and information will appear here.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getMedicalConcepts = async (text) => {
    const prompt = `Based on the following medical prescription, provide detailed medical concepts and information about the medications mentioned. 
    Explain what each medication is, how it works, and what it's used for. 
    If multiple medications are included, provide information for each one separately. 
    If no specific medication can be identified, clearly mention that. 
    Use simple, easy-to-understand language suitable for patients.Prescription:${text}Medical Concepts:`;

    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
      }

      const result = await response.json();
      const textResult = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textResult) {
        setConceptsOutput(textResult.replace(/\n/g, '\n'));
      } else {
        setConceptsOutput('No response. Try again.');
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setErrorMessage("Failed to fetch medical concepts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = () => {
    if (!prescriptionInput.trim()) {
      setErrorMessage("Please enter or upload a prescription.");
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    getMedicalConcepts(prescriptionInput);
  };


  return (
    <div className="container">
      <h1>Medical Concepts & Medicine Information</h1>

      <div className="form-group">
        <label htmlFor="prescriptionInput">Enter Medicine Name or Prescription:</label>
        <textarea
          id="prescriptionInput"
          placeholder="e.g., Paracetamol 500mg or Rx: Paracetamol 500mg – Take 1 tablet after food every 6 hours."
          value={prescriptionInput}
          onChange={(e) => setPrescriptionInput(e.target.value)}
          rows="6"
        ></textarea>
      </div>


      <button
        className="submit-btn"
        onClick={handleTextSubmit}
        disabled={isLoading || !prescriptionInput.trim()}
      >
        {isLoading ? 'Processing...' : 'Get Medical Concepts'}
      </button>

      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="output-section">
        <label>Medical Concepts & Information:</label>
        <div className="output-box">{conceptsOutput}</div>
      </div>
    </div>
  );
};

export default MedicineStudy;
