import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Nav = ({ changeList, listName }) => (
  <nav className="nav">
    <ul className="nav-list">
      <li>
        <button
          className={listName === 'collection' ? 'nav-button active' : 'nav-button'}
          type="button"
          id="collection"
          onClick={(evt) => changeList(evt.target.id)}
        >
          Collection
        </button>
      </li>
      <li>
        <button
          className={listName === 'wishlist' ? 'nav-button active' : 'nav-button'}
          type="button"
          id="wishlist"
          onClick={(evt) => changeList(evt.target.id)}
        >
          Liste d'envies
        </button>
      </li>
    </ul>
  </nav>
);

Nav.propTypes = {
  changeList: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
};

export default Nav;
