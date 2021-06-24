import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

// import upArrow from '../../assets/images/icons/up_arrow.png';
// import rightArrow from '../../assets/images/icons/right_arrow.png';

const Company = ({
  name,
  hardwareList,
  saveHardwareFilter,
  filterHardware,
  videogamesList,
  toggleCompany,
  selectedCompany,
}) => {
  const handleHardwareFilter = (evt) => {
    evt.preventDefault();
    saveHardwareFilter(evt.target.value);
  };
  const handleClick = () => {
    if (selectedCompany.name === name) {
      toggleCompany('');
    }
    else {
      toggleCompany({ name });
    }
  };
  const filteredHardware = hardwareList.filter((hardware) => hardware.company === name);
  return (
    <div className="company">
      <div
        type="button"
        className="company-button"
        onClick={handleClick}
      >
        <h3 className="company-button-title">{name} ({filteredHardware.length})</h3>
        <div className="company-button-opening">
          <p className={selectedCompany.name === name ? 'company-button-opening-arrow--open' : 'company-button-opening-arrow'}>></p>
        </div>
      </div>
      {selectedCompany.name === name && (
        <div className="company-hardware">
          {filteredHardware.map((hardware) => (
            <button
              key={hardware.id}
              className={filterHardware === hardware.name ? 'panel-button--active' : 'panel-button'}
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
      )}
    </div>
  );
};

Company.propTypes = {
  name: PropTypes.string.isRequired,
  hardwareList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  saveHardwareFilter: PropTypes.func.isRequired,
  filterHardware: PropTypes.string.isRequired,
  videogamesList: PropTypes.arrayOf(
    PropTypes.shape({
      hardware: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  toggleCompany: PropTypes.func.isRequired,
  selectedCompany: PropTypes.string.isRequired,
};

export default Company;
