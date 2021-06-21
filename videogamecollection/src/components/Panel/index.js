import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import constructors from '../../datas/company';
import Company from '../../containers/Panel/Company';

const Panel = ({
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

      <div className="panel-hardware">
        <button
          className={filterHardware === 'allhardware' ? 'panel-button--active' : 'panel-button'}
          type="button"
          value="allhardware"
          onClick={(evt) => handleHardwareFilter(evt)}
        >
          Toutes les consoles ({videogamesList.length} {videogamesList.length === 1 ? 'jeu' : 'jeux'})
        </button>
        <div className="panel-hardware-company">
          {constructors.map((constructor) => (
            <Company name={constructor.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

Panel.propTypes = {
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
