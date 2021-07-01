import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Aside from '../../containers/Aside';
import Header from '../../containers/Header/Header';
import Home from '../../containers/Home/Home';
import Games from '../../containers/Games/Games';
import Wishlist from '../../containers/Wishlist';
import AddGameModal from '../../containers/Modal/AddGameModal';
import AddHardwareModal from '../../containers/Modal/AddHardwareModal';
import DeleteModal from '../../containers/Modal/DeleteModal';
import Notification from '../../containers/App/Notification';

const App = ({
  logged,
  gameModalOpen,
  hardwareModalOpen,
  deleteModalOpen,
  listName,
  getHardware,
  getGame,
  getWishlist,
}) => {
  useEffect(() => {
    getHardware();
    getGame();
    getWishlist();
  });
  return (
    <div className="app">
      {!logged && (
        <Home />
      )}
      {logged && (
        <>
          <Header />
          <div className="app-separation">
            {listName === 'collection' && (
              <>
                <Aside />
                <Games />
              </>
            )}
            {listName === 'wishlist' && (
              <Wishlist />
            )}
            {hardwareModalOpen && (<AddHardwareModal />)}
            {gameModalOpen && (<AddGameModal />)}
            {deleteModalOpen && (<DeleteModal />)}
          </div>
        </>
      )}
      <Notification />
    </div>
  );
};

App.propTypes = {
  logged: PropTypes.bool.isRequired,
  gameModalOpen: PropTypes.bool.isRequired,
  hardwareModalOpen: PropTypes.bool.isRequired,
  deleteModalOpen: PropTypes.bool.isRequired,
  listName: PropTypes.string.isRequired,
  getHardware: PropTypes.func.isRequired,
  getGame: PropTypes.func.isRequired,
  getWishlist: PropTypes.func.isRequired,
};

export default App;
