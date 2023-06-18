import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  test('renders loading message while components are loading', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });

  test('renders GetStarted component for the root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const getStartedComponent = screen.getByTestId('get-started-component');
    expect(getStartedComponent).toBeInTheDocument();
  });

  test('renders Home component for the /home path', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );

    const homeComponent = screen.getByTestId('home-component');
    expect(homeComponent).toBeInTheDocument();
  });

  // Add more tests for other routes and components as needed
});
