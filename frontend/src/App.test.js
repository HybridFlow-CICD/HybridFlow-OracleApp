// Mock de Axios global para evitar errores de red
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Silenciar console.error durante las pruebas (para que no muestre mensajes de axios)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

test('renderiza el título principal del sistema', () => {
  render(<App />);
  const titulo = screen.getByText(/Sistema de Administración/i);
  expect(titulo).toBeInTheDocument();
});
