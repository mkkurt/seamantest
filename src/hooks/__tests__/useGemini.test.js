import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import useGemini from '../useGemini';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('useGemini', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate explanation with English language by default', async () => {
    // Mock successful API response
    const mockResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'Answer: A\nExplanation: This is the correct answer because...'
                }
              ]
            }
          }
        ]
      }
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGemini());

    await act(async () => {
      await result.current.generateExplanation(
        'What is the correct answer?',
        ['Option A', 'Option B', 'Option C']
      );
    });

    // Check that axios was called with the correct prompt
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('gemini-1.5-flash:generateContent'),
      expect.objectContaining({
        contents: [
          {
            parts: [
              {
                text: expect.stringContaining('Please respond in English.')
              }
            ]
          }
        ]
      })
    );

    expect(result.current.data).toBe('Answer: A\nExplanation: This is the correct answer because...');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should generate explanation with Turkish language when specified', async () => {
    // Mock successful API response
    const mockResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'Cevap: A\nAçıklama: Bu doğru cevaptır çünkü...'
                }
              ]
            }
          }
        ]
      }
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGemini());

    await act(async () => {
      await result.current.generateExplanation(
        'Doğru cevap nedir?',
        ['Seçenek A', 'Seçenek B', 'Seçenek C'],
        'tr'
      );
    });

    // Check that axios was called with the correct Turkish prompt
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('gemini-1.5-flash:generateContent'),
      expect.objectContaining({
        contents: [
          {
            parts: [
              {
                text: expect.stringContaining('Lütfen Türkçe yanıtlayın.')
              }
            ]
          }
        ]
      })
    );

    expect(result.current.data).toBe('Cevap: A\nAçıklama: Bu doğru cevaptır çünkü...');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    mockedAxios.post.mockRejectedValue(mockError);

    const { result } = renderHook(() => useGemini());

    await act(async () => {
      await result.current.generateExplanation(
        'What is the correct answer?',
        ['Option A', 'Option B', 'Option C']
      );
    });

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });

  it('should reset state when reset is called', () => {
    const { result } = renderHook(() => useGemini());

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});