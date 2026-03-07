import React, { useState } from 'react';
import './predict.css'
const SymptomChecker = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyCUR5WcaKPPcrouc1tQVHk500dbUls9QCk`;

  const callGemini = async (prompt) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait a moment before trying again.');
      }

      if (!response.ok) {
        throw new Error(data.error?.message || 'Something went wrong.');
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const medicalPrompt = `
User symptoms: "${text}"
You are a medical triage assistant.
Task:
Determine the MOST appropriate medical specialist the patient should consult FIRST.
Use the following medical mapping rules:
- Joint pain, bone pain, muscle pain, arthritis, knee pain, leg pain → Orthopedic
- Headache, migraine, dizziness, seizures, nerve pain → Neurologist
- Chest pain, heart palpitations, high blood pressure → Cardiologist
- Stomach pain, acidity, vomiting, digestion issues → Gastroenterologist
- Fever, weakness, unclear or general symptoms → General Physician
- Skin rashes, itching, acne, allergies → Dermatologist
- Breathing difficulty, cough, asthma → Pulmonologist
- Eye pain, vision problems → Ophthalmologist
- Ear pain, throat pain, sinus issues → ENT
Rules:
- Output ONLY the doctor name.
- No explanations.
- No punctuation.
- No additional text.
- Return only ONE doctor.
- If multiple apply, choose the most relevant primary specialist.`;
      const res = await callGemini(medicalPrompt);

      if (res?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResult(res.candidates[0].content.parts[0].text);
      } else {
        setError('No response from AI.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header >
        <h2>AI Symptom Checker</h2>
        <p>Describe your symptoms to get a suggested specialist.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          placeholder="e.g., I have a sharp pain in my lower back and a mild fever..."
          onChange={(e) => setText(e.target.value)}
          rows="4"
        />

        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? 'Analyzing...' : 'Predict'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result-container">
          <h3>Suggested Specialist:</h3>
          <div className="result-text">{result}</div>
          <div className="disclaimer">
            <strong>Disclaimer:</strong> This tool is for informational purposes only. For emergencies, call local emergency services.
          </div>
        </div>
      )}
    </div>
  );
};
export default SymptomChecker;
