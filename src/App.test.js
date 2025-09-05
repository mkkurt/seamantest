import { render, screen } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock service worker registration
global.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
};

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue('en');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders app with categories sidebar', () => {
    render(<App />);
    
    // Check if the app renders the main title
    const titleElement = screen.getByText(/categories/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders settings button', () => {
    render(<App />);
    
    const settingsButton = screen.getByText(/settings/i);
    expect(settingsButton).toBeInTheDocument();
  });

  test('shows select category message when no test is selected', () => {
    render(<App />);
    
    const messageElement = screen.getByText(/select a category/i);
    expect(messageElement).toBeInTheDocument();
  });
});
