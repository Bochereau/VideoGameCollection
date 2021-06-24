import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

// import trash from '../../assets/images/icons/trash.png';
// import upArrow from '../../assets/images/icons/up_arrow.png';
// import downArrow from '../../assets/images/icons/down_arrow.png';

// import image from '../../assets/images/icons/image.svg';

const Card = ({
  // games datas display
  id,
  name,
  hardware,
  developer,
  editor,
  release,
  finished,
  // showing game details
  toggleGame,
  selectedGame,
  getGameId,
  showDeleteModal,
  finishedGame,
  getGame,
  updateGame,
}) => {
  const handleClick = () => {
    if (selectedGame.name === name) {
      toggleGame('');
    }
    else {
      toggleGame({ name });
    }
  };
  const handleChangeFinishedGame = () => {
    finishedGame(!finished);
    updateGame();
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  return (
    <article className="gamecard" id={id} onMouseOver={() => getGameId(id)}>
      <div className="gamecard-visible">
        <h3 className="gamecard-visible-title">{name}</h3>
        <div className="gamecard-visible-item">
          <div className="gamecard-visible-item-details">
            <p className="gamecard-visible-item-details-title">Console :</p>
            <h4>{hardware}</h4>
          </div>
          <div className="gamecard-visible-item-details">
            <p className="gamecard-visible-item-details-title">Développeur :</p>
            <h4>{developer}</h4>
          </div>
          <div className="gamecard-visible-item-details">
            <p className="gamecard-visible-item-details-title">Editeur :</p>
            <h4>{editor}</h4>
          </div>
          <div className="gamecard-visible-item-details">
            <p className="gamecard-visible-item-details-title">Année de sortie :</p>
            <h4>{release}</h4>
          </div>
        </div>
        <div className="gamecard-visible-manage">
          <label htmlFor="finished">
            Terminé :<input type="checkbox" id="finished" name="finished" checked={finished} onChange={handleChangeFinishedGame} />
          </label>
          <button
            type="button"
            onClick={() => showDeleteModal()}
          >
            <span className="remove">+ </span>Supprimer
          </button>
        </div>
        <div
          className="gamecard-visible-more"
          onClick={handleClick}
        >
          <p className="gamecard-visible-more-text">Plus de details </p>
          <p className={selectedGame.name === name ? 'gamecard-visible-more-arrow--open' : 'gamecard-visible-more-arrow'}>></p>
        </div>
      </div>
      {selectedGame.name === name && (
        <div className="gamecard-open">
          <div className="gamecard-open-info">
            <div className="gamecard-open-checkboxes">
              <p>Etat : </p>
              <div>
                <label htmlFor="box">
                  <input type="checkbox" id="box" name="box" />
                  Boîte
                </label>
              </div>
              <div>
                <label htmlFor="manual">
                  <input type="checkbox" id="manual" name="manual" />
                  Notice
                </label>
              </div>
              <div>
                <label htmlFor="game">
                  <input type="checkbox" id="game" name="game" />
                  Jeu
                </label>
              </div>
              <div>
                <label htmlFor="demat">
                  <input type="checkbox" id="demat" name="demat" />
                  Dématérialisé
                </label>
              </div>
            </div>
            <div>
              <p>Description :</p>
              <textarea className="gamecard-open-description" name="description" id="description" cols="20" rows="5" placeholder="Entrez votre description" />
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

Card.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  hardware: PropTypes.string.isRequired,
  developer: PropTypes.string.isRequired,
  editor: PropTypes.string.isRequired,
  release: PropTypes.number.isRequired,
  finished: PropTypes.bool.isRequired,
  toggleGame: PropTypes.func.isRequired,
  selectedGame: PropTypes.string.isRequired,
  getGameId: PropTypes.string.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  finishedGame: PropTypes.func.isRequired,
  getGame: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired,
};

export default Card;
