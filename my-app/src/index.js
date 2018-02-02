import React from 'react';
import { render } from 'react-dom'
import App from './components/App';

const accessToken = window.location.hash.substring(14);

render(
  <App accessToken={accessToken} />,
  document.getElementById('root')
)