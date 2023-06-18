import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROW_ELEMETS } from '../helper/constants';
import Homescreen from '../pages/Home';

describe('Homescreen', () => {
  test('renders Nav component', () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>
    );

    const navComponent = screen.getByTestId('nav-component');
    expect(navComponent).toBeInTheDocument();
  });

  test('renders Banner component', () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>
    );

    const bannerComponent = screen.getByTestId('banner-component');
    expect(bannerComponent).toBeInTheDocument();
  });

  test('renders Row components', () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>
    );

    const rowComponents = screen.getAllByTestId('row-component');
    expect(rowComponents.length).toBe(ROW_ELEMETS.length);
  });

  test('renders Footer component', () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>
    );

    const footerComponent = screen.getByTestId('footer-component');
    expect(footerComponent).toBeInTheDocument();
  });

  // Add more tests as needed
});
