import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import Typed from 'react-typed';

import './style.scss';

import Login from '../../containers/Home/Login';
import Subscribe from '../../containers/Home/Subscribe';

const Home = ({ slug }) => (
  <div className="home">
    <div className="home-side">
      <h1 className="home-title">VideoGameCollection</h1>
      <h2 className="home-subtitle">Votre site de gestion de collection de Jeux Vidéo</h2>
      <p className="home-description">
        <Typed
          strings={[
            'Créer ',
            'Gérer ',
            'Modifier ',
          ]}
          typeSpeed={100}
          backSpeed={90}
          fadeOutDelay={500}
          loop
          showCursor={false}
          smartBackspace
        />
        <span> vos listes de jeux.</span>
      </p>
    </div>
    <div className="home-side home-login">
      {slug === 'login' && (
        <Login />
      )}
      {slug === 'subscribe' && (
        <Subscribe />
      )}
    </div>
  </div>
);

Home.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default Home;
