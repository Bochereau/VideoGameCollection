import React from 'react';

import './style.scss';
import videogames from '../../datas/videogames';

import Card from '../../containers/Games/Card';

const Games = () => (
  <main className="games">
    {videogames.map((videogame) => (
      <Card
        id={videogame.id}
        name={videogame.name}
        hardware={videogame.hardware}
        developer={videogame.developer}
        editor={videogame.editor}
        release={videogame.release}
        finished={videogame.finished}
      />
    ))}
  </main>
);

export default Games;
