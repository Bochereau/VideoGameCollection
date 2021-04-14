import React from 'react';

import './style.scss';

import logo from '../../assets/images/logo4.png';
import Panel from '../Panel';

const Aside = () => (
  <aside className="aside">
    <div className="aside-head">
      <img className="aside-logo" src={logo} alt="logo" />
    </div>
    <Panel />
  </aside>
);

export default Aside;
