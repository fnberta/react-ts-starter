import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';

const root = (
  <BrowserRouter>
    <Route path="/" component={App} />
  </BrowserRouter>
);

render(root, document.getElementById('root'));
