import { render, screen, fireEvent } from '@testing-library/react';
import RandomQuestionGame from '../RandomQuestionGame';
import { StoreProvider } from '../../store';

// Mock the context that provides test data
const mockStoreValue = {
  state: {
    selectedCategory: 'Test Category',
    questions: [
      {
        id: 1,
        question: 'Test question 1?',
        options: ['A) Option 1', 'B) Option 2', 'C) Option 3'],
        correctAnswer: 'A) Option 1'
      },
      {
        id: 2,
        question: 'Test question 2?',
        options: ['A) Option A', 'B) Option B', 'C) Option C'],
        correctAnswer: 'B) Option B'
      }
    ]
  },
  dispatch: jest.fn(),
  loadTest: jest.fn(),
  handleAnswerSelect: jest.fn(),
  calculateResults: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock useStore hook
jest.mock('../../store', () => ({
  ...jest.requireActual('../../store'),
  useStore: () => mockStoreValue,
  StoreProvider: ({ children }) => children
}));

describe('Adaptive Weighting System', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue('{}');
    localStorageMock.setItem.mockClear();
  });

  test('initializes question weights from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('{"1": 1.5, "2": 0.5}');
    
    render(
      <StoreProvider>
        <RandomQuestionGame />
      </StoreProvider>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('questionWeights');
  });

  test('saves question weights to localStorage when updated', () => {
    render(
      <StoreProvider>
        <RandomQuestionGame />
      </StoreProvider>
    );

    // Simulate answering a question correctly
    const answerButton = screen.getByText('A) Option 1');
    fireEvent.click(answerButton);

    // Check if localStorage.setItem was called to save weights
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'questionWeights',
      expect.stringContaining('"1"')
    );
  });

  test('shows Very Easy button after correct answer', () => {
    render(
      <StoreProvider>
        <RandomQuestionGame />
      </StoreProvider>
    );

    // Answer correctly
    const correctAnswer = screen.getByText('A) Option 1');
    fireEvent.click(correctAnswer);

    // Go to previous question to see the result
    const prevButton = screen.getByText('Previous Question');
    fireEvent.click(prevButton);

    // Should show Very Easy button after correct answer
    expect(screen.getByText('Çok Kolay')).toBeInTheDocument();
  });

  test('clears question weights when reset score is clicked', () => {
    render(
      <StoreProvider>
        <RandomQuestionGame />
      </StoreProvider>
    );

    const resetButton = screen.getByText('Skoru sıfırla');
    fireEvent.click(resetButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('questionWeights');
  });
});