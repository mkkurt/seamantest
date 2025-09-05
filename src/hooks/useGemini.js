import { useState, useCallback } from "react";
import axios from "axios";

const useGemini = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateExplanation = useCallback(async (question, options) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Construct the prompt to ask for explanation and answer
      const prompt = `Question: ${question}\n\nOptions:\n${options.map((option, index) => `${index + 1}. ${option}`).join('\n')}\n\nPlease provide:\n1. The correct answer (just state which option letter/number)\n2. A detailed explanation of why this is the correct answer\n\nFormat your response as:\nAnswer: [correct option]\nExplanation: [detailed explanation]`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      // Using Gemini 2.5 Flash model (if available, fallback to 1.5 Flash)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
      
      const response = await axios.post(url, requestBody);
      
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const content = response.data.candidates[0].content;
        if (content && content.parts && content.parts.length > 0) {
          setData(content.parts[0].text);
        } else {
          throw new Error('No content in response');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      setError(error);
    }

    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, generateExplanation, reset };
};

export default useGemini;
