import React from 'react';

import './style.scss';

const Nav = () => (
  <nav className="nav">
    <ul className="nav-list">
      <li><button className="nav-button active" type="button">Collection</button></li>
      <li><button className="nav-button" type="button">Liste d'envies</button></li>
    </ul>
  </nav>
);

export default Nav;
