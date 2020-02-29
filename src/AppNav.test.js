import React from 'react';
import { render } from '@testing-library/react';
import AppNav from './AppNav';
import { MemoryRouter } from 'react-router-dom';

test('it renders the title', () => {
  const { getByText } = render(<MemoryRouter><AppNav title="Title" /></MemoryRouter>);
  const linkElement = getByText(/Title/i);
  expect(linkElement).toBeInTheDocument();
});
