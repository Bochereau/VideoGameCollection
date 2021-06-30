import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Wishlist = ({ wishlist }) => (
  <div className="wishlist">
    {wishlist.map((game) => (
      <article className="wishlist-game" id={game.id}>
        <h3 className="wishlist-game-title">{game.name}</h3>
        <div className="wishlist-game-item">
          <p className="wishlist-game-item-title">Console :</p>
          <h4 className="wishlist-game-item-name">{game.hardware}</h4>
        </div>
        <div className="wishlist-game-item">
          <p className="wishlist-game-item-title">Développeur :</p>
          <h4 className="wishlist-game-item-name">{game.developer}</h4>
        </div>
        <div className="wishlist-game-item">
          <p className="wishlist-game-item-title">Console :</p>
          <h4 className="wishlist-game-item-name">{game.editor}</h4>
        </div>
        <div className="wishlist-game-item">
          <p className="wishlist-game-item-title">Console :</p>
          <h4 className="wishlist-game-item-name">{game.release}</h4>
        </div>
        <div className="wishlist-game-manage">
          <button type="button"><span className="add">+</span>Ajouter à la collection</button>
          <button type="button"><span className="remove">x </span>Supprimer</button>
        </div>
      </article>
    ))}
  </div>
);

Wishlist.propTypes = {
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      hardware: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      editor: PropTypes.string.isRequired,
      release: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default Wishlist;
