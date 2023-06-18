import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GetStarted from '../pages/GetStarted';

describe('GetStarted', () => {
  test('renders sign in button initially', () => {
    render(
      <MemoryRouter>
        <GetStarted />
      </MemoryRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    expect(signInButton).toBeInTheDocument();
  });

  test('renders sign up button when sign in button is clicked', () => {
    render(
      <MemoryRouter>
        <GetStarted />
      </MemoryRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
    expect(signUpButton).toBeInTheDocument();
  });

  test('calls setEmail function when email input value changes', () => {
    render(
      <MemoryRouter>
        <GetStarted />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toBe('test@example.com');
  });

  test('navigates to /register when sign up button is clicked', () => {
    const navigateMock = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigateMock,
    }));

    render(
      <MemoryRouter>
        <GetStarted />
      </MemoryRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
    fireEvent.click(signUpButton);

    expect(navigateMock).toHaveBeenCalledWith('/register');
  });

  // Add more tests as needed
});
