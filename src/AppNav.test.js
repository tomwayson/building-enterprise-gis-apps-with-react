import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppNav from './AppNav';

test('it renders the title', () => {
  const { getByText } = render(<MemoryRouter><AppNav title="Title" /></MemoryRouter>);
  const linkElement = getByText(/Title/i);
  expect(linkElement).toBeInTheDocument();
});
