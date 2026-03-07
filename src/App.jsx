import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import './App.css';
import Navbar from './Navbar';
import SymptomChecker from './Predict';

const App = () => {
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const [summaryOutput, setSummaryOutput] = useState('Your simplified prescription summary will appear here.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const summarizePrescription = async (textToSummarize) => {
    if (!textToSummarize.trim()) {
      setSummaryOutput('Please enter a medical prescription to summarize.');
      return;
    }

    setSummaryOutput('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const prompt = `Summarize the following medical prescription into simple, easy-to-understand language for a patient. 
Explain what the medication is for, how to take it, and any important notes. 
Do not include side effects or prevention techniques in the summary. Keep it concise and clear.

Prescription:
${textToSummarize}

Summary:`;

      const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = 'AIzaSyAKVhbxpQz71nC7DPhCv6MGvNDu0Af-CTc'; // Add your Gemini API key here
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.statusText} - ${errorData.error.message}`);
      }

      const result = await response.json();

      if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = result.candidates[0].content.parts[0].text;
        const formatted = text.replace(/\n/g, '<br/>');
        setSummaryOutput(formatted);
      } else {
        setSummaryOutput('Could not generate a summary. Try again with different input.');
      }
    } catch (error) {
      console.error('Error summarizing prescription:', error);
      setErrorMessage('An error occurred. Please try again.');
      setSummaryOutput('Failed to summarize. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WEBP, etc).');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSummaryOutput('Extracting text from image...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageDataUrl = e.target.result;
        const worker = await createWorker('eng');
        const { data } = await worker.recognize(imageDataUrl);
        await worker.terminate();

        const extractedText = data.text.trim();
        setPrescriptionInput(extractedText);
        summarizePrescription(extractedText);
      } catch (error) {
        console.error('OCR Error:', error);
        setErrorMessage('Failed to extract text from image.');
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read the file. Please try again.');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Medical Prescription Summarizer</h1>

        <div className="form-group">
          <label htmlFor="prescriptionInput">Enter Medical Prescription (optional):</label>
          <textarea
            id="prescriptionInput"
            value={prescriptionInput}
            onChange={(e) => setPrescriptionInput(e.target.value)}
            rows="6"
            placeholder="Or upload an image of a prescription below..."
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="fileUpload">Upload Prescription Image (JPG, PNG, WebP, etc):</label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        <button
          className="submit-btn"
          onClick={() => summarizePrescription(prescriptionInput)}
          disabled={isLoading || !prescriptionInput.trim()}
        >
          {isLoading ? 'Processing...' : 'Summarize Prescription'}
        </button>

        {isLoading && <div className="loading">Loading...</div>}
        {errorMessage && <div className="error-box">{errorMessage}</div>}

        <div className="form-group">
          <label>Simplified Summary:</label>
          <div className="output-box" dangerouslySetInnerHTML={{ __html: summaryOutput }} />
        </div>

        <hr />

      </div>
    </>
  );
};

export default App;
