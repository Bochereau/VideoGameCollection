import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

// import constructors from '../../datas/constructor';

const Panel = ({
  hardwareList,
  saveHardwareFilter,
  filterHardware,
  showHardwareModal,
  videogamesList,
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
        Toutes les consoles ({videogamesList.length} {videogamesList.length === 1 ? 'jeu' : 'jeux'})
      </button>

      {hardwareList.map((hardware) => (
        <button
          key={hardware.id}
          className={filterHardware === hardware.name ? 'panel-button active' : 'panel-button'}
          type="button"
          value={hardware.name}
          onClick={(evt) => handleHardwareFilter(evt)}
        >
          {hardware.name} ({videogamesList.filter(
            (videogame) => videogame.hardware === hardware.name,
          ).length} {videogamesList.filter(
            (videogame) => videogame.hardware === hardware.name,
          ).length === 1 ? 'jeu' : 'jeux'})
        </button>
      ))}
    </div>
  );
};

Panel.propTypes = {
  hardwareList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  saveHardwareFilter: PropTypes.func.isRequired,
  filterHardware: PropTypes.string.isRequired,
  showHardwareModal: PropTypes.func.isRequired,
  videogamesList: PropTypes.arrayOf(
    PropTypes.shape({
      hardware: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default Panel;
