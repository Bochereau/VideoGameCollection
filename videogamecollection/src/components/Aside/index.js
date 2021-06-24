import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import pad from '../../assets/images/icons/dpad.png';
import Panel from '../../containers/Panel';

const Aside = ({ openAside, toggleAside }) => (
  <aside className={(toggleAside ? 'aside  aside--open' : 'aside')}>
    <div className={(toggleAside ? 'aside-panel  aside-panel--open' : 'aside-panel')}>
      <Panel />
    </div>
    <div className="aside-toggle">
      <button
        type="button"
        className="aside-button"
        onClick={() => openAside()}
      >
        <img className="aside-button-img" src={pad} alt="pad +" />
      </button>
    </div>
  </aside>
);

Aside.propTypes = {
  toggleAside: PropTypes.bool.isRequired,
  openAside: PropTypes.func.isRequired,
};

export default Aside;
