import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import logo from '../../assets/images/logo.png';
import Nav from '../../containers/Nav';

const Header = ({
  logout,
  showGameModal,
  saveGameFilter,
  filterGame,
  listName,
  pseudo,
  boxGame,
  manualGame,
  physicalGame,
  dematGame,
  newGameDescription,
  saveSearch,
  search,
}) => {
  const handleFilter = (evt) => {
    evt.preventDefault();
    saveGameFilter(evt.target.value);
  };
  const handleModalOpen = (evt) => {
    evt.preventDefault();
    boxGame(false);
    manualGame(false);
    physicalGame(false);
    dematGame(false);
    newGameDescription('');
    showGameModal();
  };
  return (
    <header className="header">
      <div className="header-logo">
        <img className="header-logo-img" src={logo} alt="logo" />
      </div>
      <div className="header-menu">
        <div className="header-nav">
          <Nav />
          <button
            className="header-ranking-add"
            type="button"
            id="addGame"
            onClick={handleModalOpen}
          >
            <span className="add">+</span> Ajouter un jeu
          </button>
          <div className="header-user">
            <h2 className="header-user-welcome">Bienvenue {pseudo}</h2>
            <button
              className="header-user-logout"
              type="button"
              onClick={() => logout()}
            >
              Se deconnecter
            </button>
          </div>
        </div>
        {listName === 'collection' && (
          <>
            <hr />
            <div className="header-ranking">
              <div className="header-select">
                <p className="header-select-title">Trier par :</p>
                <div className="header-select-list">
                  <button
                    className={filterGame === 'allgames' ? 'header-select-link active' : 'header-select-link'}
                    type="button"
                    value="allgames"
                    onClick={handleFilter}
                  >
                    Tous les jeux
                  </button>
                  <button
                    className={filterGame === 'finished' ? 'header-select-link active' : 'header-select-link'}
                    type="button"
                    value="finished"
                    onClick={handleFilter}
                  >
                    Jeux terminés
                  </button>
                  <button
                    className={filterGame === 'unfinished' ? 'header-select-link active' : 'header-select-link'}
                    type="button"
                    onClick={handleFilter}
                    value="unfinished"
                  >
                    Jeux à faire
                  </button>
                </div>
              </div>
              <form className="header-search">
                <input
                  className="header-search-input"
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Rechercher un jeu"
                  value={search}
                  onChange={(evt) => saveSearch(evt.target.value)}
                />
              </form>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  showGameModal: PropTypes.func.isRequired,
  saveGameFilter: PropTypes.func.isRequired,
  filterGame: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  pseudo: PropTypes.string.isRequired,
  boxGame: PropTypes.func.isRequired,
  manualGame: PropTypes.func.isRequired,
  physicalGame: PropTypes.func.isRequired,
  dematGame: PropTypes.func.isRequired,
  newGameDescription: PropTypes.func.isRequired,
  saveSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

export default Header;
