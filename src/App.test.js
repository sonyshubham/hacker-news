import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import NewsItem from './components/NewsItem';

test('renders hacker news app', () => {
  const { getAllByAltText } = render(<App />);
  const loaderElement = getAllByAltText(/spinner/)
  expect(loaderElement[0]).toBeInTheDocument();
});