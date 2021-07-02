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
  search,
}) => {
  useEffect(async () => {
    await getGame();
  });
  const searchString = search.toLowerCase();
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
  function filteredGame(value, filter) {
    if (search !== '') {
      const searchedGames = (
        videogames.filter((videogame) => videogame.name.toLowerCase().includes(value)));
      return searchedGames;
    }
    if (filter === 'finished') {
      const finishedGames = videogames.filter((videogame) => videogame.finished === true);
      return finishedGames;
    }
    if (filter === 'unfinished') {
      const unfinishedGames = videogames.filter((videogame) => videogame.finished === false);
      return unfinishedGames;
    }
    return videogames;
  }
  return (
    <main className="games">
      {hardwareFilter(filteredGame(searchString, filterGame)).map((videogame) => (
        <Card
          key={videogame._id}
          id={videogame._id}
          {...videogame}
        />
      ))}
    </main>
  );
};

Games.propTypes = {
  filterGame: PropTypes.string.isRequired,
  filterHardware: PropTypes.string.isRequired,
  videogames: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  search: PropTypes.string.isRequired,
};

export default Games;
