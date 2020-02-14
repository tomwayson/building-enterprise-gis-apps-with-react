import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  const { getByText } = render(<App title="Title" />);
  const linkElement = getByText(/Title/i);
  expect(linkElement).toBeInTheDocument();
});
