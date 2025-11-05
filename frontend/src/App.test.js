import { render, screen } from '@testing-library/react';
import App from './App';
// Archivo de test eliminado por limpieza. 
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
