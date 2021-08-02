/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Wishlist = ({
  wishlist,
  getGameId,
  gameId,
  showDeleteModal,
  showTransferModal,
  newGameName,
  newGameHardware,
  newGameEditor,
  newGameDeveloper,
  newGameRelease,
}) => {
  const handleClickTransfer = (evt) => {
    evt.preventDefault();
    const foundGame = wishlist.find((game) => gameId === game._id);
    if (foundGame) {
      newGameName(foundGame.name);
      newGameHardware(foundGame.hardware);
      newGameEditor(foundGame.editor);
      newGameDeveloper(foundGame.developer);
      newGameRelease(foundGame.release);
      showTransferModal(true);
    }
  };
  return (
    <div className="wishlist">
      {wishlist.map((game) => (
        <article
          className="wishlist-game"
          key={game._id}
          id={game._id}
          onMouseOver={() => getGameId(game._id)}
        >
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
            <p className="wishlist-game-item-title">Editeur :</p>
            <h4 className="wishlist-game-item-name">{game.editor}</h4>
          </div>
          <div className="wishlist-game-item">
            <p className="wishlist-game-item-title">Année de sortie :</p>
            <h4 className="wishlist-game-item-name">{game.release}</h4>
          </div>
          <div className="wishlist-game-manage">
            <button
              type="button"
              className="wishlist-game-manage-add"
              onClick={handleClickTransfer}
            >
              <span className="add">+</span>Ajouter à la collection
            </button>
            <button
              type="button"
              className="wishlist-game-manage-delete"
              onClick={() => showDeleteModal()}
            ><span className="remove">x </span>Supprimer
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

Wishlist.propTypes = {
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      hardware: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      editor: PropTypes.string.isRequired,
      release: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  getGameId: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  showTransferModal: PropTypes.func.isRequired,
  newGameName: PropTypes.func.isRequired,
  newGameHardware: PropTypes.func.isRequired,
  newGameEditor: PropTypes.func.isRequired,
  newGameDeveloper: PropTypes.func.isRequired,
  newGameRelease: PropTypes.func.isRequired,
};

export default Wishlist;
