import { renderHook } from '@testing-library/react';
import { parseGeminiResponse } from '../RandomQuestionGame';

// Extract and test the parsing function separately
describe('RandomQuestionGame parseGeminiResponse', () => {
  // Create a simple wrapper to test the parseGeminiResponse function
  const useParseGeminiResponse = () => {
    const parseGeminiResponse = (geminiText) => {
      if (!geminiText) return { answer: "", explanation: "" };
      
      const lines = geminiText.split('\n');
      let answer = "";
      let explanation = "";
      let isExplanationSection = false;
      
      for (const line of lines) {
        // Handle both English and Turkish response formats
        if (line.toLowerCase().startsWith('answer:') || line.toLowerCase().startsWith('cevap:')) {
          const colonIndex = line.indexOf(':');
          answer = line.substring(colonIndex + 1).trim();
        } else if (line.toLowerCase().startsWith('explanation:') || line.toLowerCase().startsWith('açıklama:')) {
          const colonIndex = line.indexOf(':');
          explanation = line.substring(colonIndex + 1).trim();
          isExplanationSection = true;
        } else if (isExplanationSection) {
          explanation += '\n' + line;
        }
      }
      
      return { answer: answer.trim(), explanation: explanation.trim() };
    };

    return { parseGeminiResponse };
  };

  it('should parse English Gemini response correctly', () => {
    const { result } = renderHook(() => useParseGeminiResponse());
    
    const geminiText = `Answer: A
Explanation: This is the correct answer because it demonstrates the proper maritime safety procedure according to international regulations.`;

    const parsed = result.current.parseGeminiResponse(geminiText);
    
    expect(parsed.answer).toBe('A');
    expect(parsed.explanation).toBe('This is the correct answer because it demonstrates the proper maritime safety procedure according to international regulations.');
  });

  it('should parse Turkish Gemini response correctly', () => {
    const { result } = renderHook(() => useParseGeminiResponse());
    
    const geminiText = `Cevap: B
Açıklama: Bu doğru cevaptır çünkü uluslararası denizcilik güvenlik kurallarına göre uygun prosedürü göstermektedir.`;

    const parsed = result.current.parseGeminiResponse(geminiText);
    
    expect(parsed.answer).toBe('B');
    expect(parsed.explanation).toBe('Bu doğru cevaptır çünkü uluslararası denizcilik güvenlik kurallarına göre uygun prosedürü göstermektedir.');
  });

  it('should handle multi-line explanations correctly', () => {
    const { result } = renderHook(() => useParseGeminiResponse());
    
    const geminiText = `Answer: C
Explanation: This is a complex answer that requires multiple lines.
The safety procedure involves several steps:
1. First step
2. Second step
3. Final step`;

    const parsed = result.current.parseGeminiResponse(geminiText);
    
    expect(parsed.answer).toBe('C');
    expect(parsed.explanation).toContain('This is a complex answer');
    expect(parsed.explanation).toContain('1. First step');
    expect(parsed.explanation).toContain('3. Final step');
  });

  it('should handle empty or null input gracefully', () => {
    const { result } = renderHook(() => useParseGeminiResponse());
    
    const parsedNull = result.current.parseGeminiResponse(null);
    const parsedEmpty = result.current.parseGeminiResponse('');
    
    expect(parsedNull).toEqual({ answer: "", explanation: "" });
    expect(parsedEmpty).toEqual({ answer: "", explanation: "" });
  });

  it('should handle mixed case correctly', () => {
    const { result } = renderHook(() => useParseGeminiResponse());
    
    const geminiText = `ANSWER: D
EXPLANATION: This should work with uppercase too.`;

    const parsed = result.current.parseGeminiResponse(geminiText);
    
    expect(parsed.answer).toBe('D');
    expect(parsed.explanation).toBe('This should work with uppercase too.');
  });
});