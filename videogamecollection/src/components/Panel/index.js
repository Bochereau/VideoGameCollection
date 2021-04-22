import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Panel = ({ hardwareList, saveHardwareFilter }) => {
  const handleHardwareFilter = (evt) => {
    evt.preventDefault();
    saveHardwareFilter(evt.target.value);
  };
  return (
    <div className="panel">
      <h2 className="panel-title">Vos consoles</h2>
      <button className="panel-button-add" type="button"><span className="add">+</span> Ajouter une console</button>
      <button
        className="panel-button active"
        type="button"
        value="allhardware"
        onClick={(evt) => handleHardwareFilter(evt)}
      >
        Toutes les consoles (25)
      </button>
      {hardwareList.map((item) => (
        <button
          key={item.id}
          className="panel-button"
          type="button"
          value={item.hardware}
          onClick={(evt) => handleHardwareFilter(evt)}
        >
          {item.hardware} (...)
        </button>
      ))}
    </div>
  );
};

Panel.propTypes = {
  hardwareList: PropTypes.arrayOf(
    PropTypes.shape({
      hardware: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  saveHardwareFilter: PropTypes.func.isRequired,
};

export default Panel;
