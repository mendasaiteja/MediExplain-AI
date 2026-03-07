import React, { useState } from 'react';
import './SideEffect.css';
import Navbar from './Navbar';

const SideEffect = () => {
    const [prescriptionInput, setPrescriptionInput] = useState('');
    const [sideEffectsOutput, setSideEffectsOutput] = useState('Side effects information will appear here.');
    const [isLoadingSideEffects, setIsLoadingSideEffects] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sideEffectsErrorMessage, setSideEffectsErrorMessage] = useState('');

    const getSideEffects = async () => {
        const trimmedInput = prescriptionInput.trim();

        if (!trimmedInput) {
            setSideEffectsOutput('Please enter a medical prescription first to get side effects.');
            setSideEffectsErrorMessage('');
            return;
        }

        setSideEffectsOutput('');
        setSideEffectsErrorMessage('');
        setIsLoadingSideEffects(true);

        try {
            const prompt = `Based on the following medical prescription, please list the common side effects of any medications mentioned. If multiple medications are present, list side effects for each. If no specific medication is clearly identifiable, state that. Keep the language simple and easy to understand.\n\nPrescription:\n${trimmedInput}\n\nCommon Side Effects:`;

            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyAKVhbxpQz71nC7DPhCv6MGvNDu0Af-CTc"; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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

            if (
                result.candidates &&
                result.candidates.length > 0 &&
                result.candidates[0].content?.parts?.length > 0
            ) {
                const text = result.candidates[0].content.parts[0].text;
                setSideEffectsOutput(text.replace(/\n/g, '\n'));
            } else {
                setSideEffectsOutput("Could not retrieve side effects. Please try again.");
                console.error("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error getting side effects:", error);
            setSideEffectsErrorMessage('An error occurred fetching side effects. Please try again.');
            setSideEffectsOutput("Failed to get side effects. Please check your input or try again later.");
        } finally {
            setIsLoadingSideEffects(false);
        }
    };

  

    return (<>
    <Navbar/>
        <div className="container">
            <h1>Medical Prescription Side Effects Checker</h1>

            <div>
                <label htmlFor="prescriptionInput">Enter Medical Prescription:</label>
                <textarea
                    id="prescriptionInput"
                    placeholder="e.g., Rx: Amoxicillin 500mg, Take 1 capsule by mouth every 8 hours for 7 days."
                    value={prescriptionInput}
                    onChange={(e) => setPrescriptionInput(e.target.value)}
                    rows="6"
                ></textarea>
            </div>

            <div className="flex">
                <button
                    id="sideEffectsButton"
                    onClick={getSideEffects}
                    disabled={isLoadingSideEffects || !prescriptionInput.trim()}
                >
                    {isLoadingSideEffects ? 'Getting Side Effects...' : 'Get Side Effects'}
                </button>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="output-section">
                <label>Common Side Effects:</label>
                <div id="sideEffectsOutput">{sideEffectsOutput}</div>
                {sideEffectsErrorMessage && (
                    <div className="error-message">{sideEffectsErrorMessage}</div>
                )}
            </div>
        </div>
        </>
    );
};

export default SideEffect;
