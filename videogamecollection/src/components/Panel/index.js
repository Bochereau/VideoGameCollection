import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Panel = ({
  hardwareList,
  saveHardwareFilter,
  filterHardware,
  showHardwareModal,
}) => {
  const handleHardwareFilter = (evt) => {
    evt.preventDefault();
    saveHardwareFilter(evt.target.value);
  };
  return (
    <div className="panel">
      <h2 className="panel-title">Vos consoles</h2>
      <button
        className="panel-button-add"
        type="button"
        onClick={() => showHardwareModal()}
      >
        <span className="add">+</span> Ajouter une console
      </button>
      <button
        className={filterHardware === 'allhardware' ? 'panel-button active' : 'panel-button'}
        type="button"
        value="allhardware"
        onClick={(evt) => handleHardwareFilter(evt)}
      >
        Toutes les consoles (25)
      </button>
      {hardwareList.map((item) => (
        <button
          key={item.id}
          className={filterHardware === item.hardware ? 'panel-button active' : 'panel-button'}
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
  filterHardware: PropTypes.string.isRequired,
  showHardwareModal: PropTypes.func.isRequired,
};

export default Panel;
