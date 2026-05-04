import React, { useState } from "react";
import "./MedicalAI.css";

const MedicalAI = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("summary");

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    console.warn("VITE_API_KEY is not defined in .env");
  }

  const callGemini = async (prompt) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API error");
    }

    return data;
  };

  const generatePrompt = () => {
    switch (mode) {
      case "summary":
        return `Summarize the following medical input in simple language:\n"${text}"`;

      case "prevention":
        return `Based on the symptoms: "${text}", provide prevention tips in simple language.`;

      case "sideeffects":
        return `For the medicine or symptoms: "${text}", list common side effects in simple terms.`;

      case "study":
        return `Explain in detail about: "${text}". Include what it is, causes, and treatment.`;

      default:
        return text;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const prompt = generatePrompt();
      const res = await callGemini(prompt);

      const output = res?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (output) {
        setResult(output);
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
      <h2>Medical AI Assistant</h2>

      <div className="tabs">
        <button onClick={() => setMode("summary")} className={mode==="summary" ? "active":""}>Summary</button>
        <button onClick={() => setMode("prevention")} className={mode==="prevention" ? "active":""}>Prevention</button>
        <button onClick={() => setMode("sideeffects")} className={mode==="sideeffects" ? "active":""}>Side Effects</button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          placeholder="Enter symptoms or medicine..."
          onChange={(e) => setText(e.target.value)}
          />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalAI;