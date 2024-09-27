import { useState, useEffect } from "react";
import axios from "axios";

const useGemini = ({ body }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
        const response = await axios.post(
          url,
          // {
          //   contents: [
          //     {
          //       parts: [{ text: "Write a story about a magic backpack." }],
          //     },
          //   ],
          // }
          body
        );
        setData(response.data);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useGemini;
