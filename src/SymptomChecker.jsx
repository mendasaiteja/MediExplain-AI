import React, { useState } from "react";
import "./SymptomChecker.css";
import Navbar from "./Navbar";

const SymptomChecker = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    console.warn("VITE_API_KEY is not defined in .env");
  }

  const callGemini = async (prompt) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await response.json();
      if (response.status === 429) {
        throw new Error("Rate limit reached. Try again later.");
      }
      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong.");
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
    setError("");
    setResult("");

    try {
      const medicalPrompt = `
User symptoms: "${text}"

You are a medical triage assistant.

Determine the MOST appropriate medical specialist.

Rules:
- Output ONLY one doctor name
- No explanation
- No punctuation

Options:
Orthopedic, Neurologist, Cardiologist, Gastroenterologist, General Physician, Dermatologist, Pulmonologist, Ophthalmologist, ENT
`;

      const res = await callGemini(medicalPrompt);

      if (res?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResult(res.candidates[0].content.parts[0].text);
      } else {
        setError("No response from AI");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="container">
      <header>
        <h2>AI Symptom Checker</h2>
        <p>Describe your symptoms to get a suggested specialist.</p>
      </header>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          placeholder="e.g., I have a sharp pain in my lower back and fever..."
          onChange={(e) => setText(e.target.value)}
          rows="4"
          />
        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Analyzing..." : "Predict"}
        </button>
      </form>
      {error && <div className="error-box">{error}</div>}
      {result && (
        <div className="result-container">
          <h3>Suggested Specialist:</h3>
          <div className="result-text">{result}</div>
          <div className="disclaimer">
            <strong>Disclaimer:</strong> This tool is for informational purposes only.
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;