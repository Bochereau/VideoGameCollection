import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/App/App';
import store from './store';

import './styles/index.scss';

// import Bootstrap css
// eslint-disable-next-line import/no-extraneous-dependencies
import 'bootstrap/dist/css/bootstrap.min.css';

const rootReactElement = (
  <Provider store={store}>
    <App />
  </Provider>
);
const target = document.getElementById('root');
render(rootReactElement, target);
