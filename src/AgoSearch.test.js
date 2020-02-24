import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AgoSearch from './AgoSearch';

test('it should pass input value on submit', () => {
  function onSearch (q) {
    expect(q).toBe('test');
  }
  const { getByPlaceholderText, getByText } = render(<AgoSearch onSearch={onSearch} />);
  // simulate user typing in 'test' and clicking search
  const input = getByPlaceholderText(/search for items/i);
  fireEvent.change(input, { target: { value: 'test' }});
  const button = getByText('Search');
  fireEvent.click(button);
});
