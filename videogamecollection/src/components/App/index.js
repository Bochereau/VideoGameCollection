import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Aside from '../Aside';
import Header from '../../containers/Header/Header';
import Home from '../../containers/Home/Home';
import Games from '../Games';

const App = ({ logged }) => (
  <div className="app">
    {!logged && (
      <Home />
    )}
    {logged && (
      <>
        <Aside />
        <div className="app-separation">
          <Header />
          <Games />
        </div>
      </>
    )}
  </div>
);

App.propTypes = {
  logged: PropTypes.bool.isRequired,
};

export default App;
