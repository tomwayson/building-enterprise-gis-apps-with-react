import React from 'react';
import { render } from '@testing-library/react';
import AppNav from './AppNav';

test('it renders the title', () => {
  const { getByText } = render(<AppNav title="Title" />);
  const linkElement = getByText(/Title/i);
  expect(linkElement).toBeInTheDocument();
});

// TODO: when rendered at mobile size
// it shows the nav items when the button is clicked
