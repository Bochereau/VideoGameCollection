import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Nav from '../Nav';

const Header = ({ logout }) => (
  <header className="header">
    <div className="header-nav">
      <Nav />
      <form className="header-search">
        <input className="header-search-input" type="text" name="search" id="search" placeholder="Rechercher un jeu" />
        <button className="header-search-submit" type="submit">Chercher</button>
      </form>
      <div className="header-user">
        <h2 className="header-user-welcome">Bonjour, Antoine</h2>
        <button
          className="header-user-logout"
          type="button"
          onClick={() => logout()}
        >
          Se deconnecter
        </button>
      </div>
    </div>
    <hr />
    <div className="header-ranking">
      <div className="header-select">
        <p className="header-select-title">Trier par :</p>
        <div className="header-select-list">
          <button className="header-select-link active" type="button">Tous les jeux</button>
          <button className="header-select-link" type="button">Jeux terminés</button>
          <button className="header-select-link" type="button">Jeux à faire</button>
        </div>
      </div>
      <button className="header-ranking-add" type="button"><span className="add">+</span> Ajouter un jeu</button>
    </div>
  </header>
);

Header.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Header;
