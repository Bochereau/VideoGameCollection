/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Card from '../../containers/Games/Card';
import { getGame } from '../../actions/game';

const Games = ({
  videogames,
  filterGame,
  filterHardware,
}) => {
  useEffect(async () => {
    await getGame();
  });
  function hardwareFilter(games) {
    let result;
    if (filterHardware === 'allhardware') {
      result = games;
    }
    else {
      result = games.filter((videogame) => (filterHardware === videogame.hardware));
    }
    return result;
  }
  const finishedGames = videogames.filter((videogame) => videogame.finished === true);
  const unfinishedGames = videogames.filter((videogame) => videogame.finished === false);
  return (
    <main className="games">
      {filterGame === 'allgames' && (hardwareFilter(videogames).map((videogame) => (
        <Card
          key={videogame._id}
          id={videogame._id}
          name={videogame.name}
          hardware={videogame.hardware}
          developer={videogame.developer}
          editor={videogame.editor}
          release={videogame.release}
          finished={videogame.finished}
        />
      )))}
      {filterGame === 'finished' && (hardwareFilter(finishedGames).map((videogame) => (
        <Card
          key={videogame._id}
          id={videogame._id}
          name={videogame.name}
          hardware={videogame.hardware}
          developer={videogame.developer}
          editor={videogame.editor}
          release={videogame.release}
          finished={videogame.finished}
        />
      )))}
      {filterGame === 'unfinished' && (hardwareFilter(unfinishedGames).map((videogame) => (
        <Card
          key={videogame._id}
          id={videogame._id}
          name={videogame.name}
          hardware={videogame.hardware}
          developer={videogame.developer}
          editor={videogame.editor}
          release={videogame.release}
          finished={videogame.finished}
        />
      )))}
    </main>
  );
};

Games.propTypes = {
  filterGame: PropTypes.string.isRequired,
  filterHardware: PropTypes.string.isRequired,
  videogames: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      hardware: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      editor: PropTypes.string.isRequired,
      release: PropTypes.number.isRequired,
      finished: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
};

export default Games;
