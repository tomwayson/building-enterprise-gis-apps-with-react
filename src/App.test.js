import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Enterprise ArcGIS App/i);
  expect(linkElement).toBeInTheDocument();
});
