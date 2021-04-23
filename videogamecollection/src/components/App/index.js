import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Aside from '../Aside';
import Header from '../../containers/Header/Header';
import Home from '../../containers/Home/Home';
import Games from '../../containers/Games/Games';
import AddGameModal from '../../containers/Modal/AddGameModal';
import AddHardwareModal from '../../containers/Modal/AddHardwareModal';

const App = ({ logged, gameModalOpen, hardwareModalOpen }) => (
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
          {hardwareModalOpen && (<AddHardwareModal />)}
          {gameModalOpen && (<AddGameModal />)}
        </div>
      </>
    )}
  </div>
);

App.propTypes = {
  logged: PropTypes.bool.isRequired,
  gameModalOpen: PropTypes.bool.isRequired,
  hardwareModalOpen: PropTypes.bool.isRequired,
};

export default App;
