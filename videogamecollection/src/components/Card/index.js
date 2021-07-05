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
  box,
  manual,
  physical,
  demat,
  description,
  newDescription,
  // showing game details
  toggleGame,
  selectedGame,
  getGameId,
  showDeleteModal,
  // update game in DB
  finishedGame,
  boxGame,
  manualGame,
  physicalGame,
  dematGame,
  newGameDescription,
  getGame,
  updateGame,
}) => {
  const handleClick = () => {
    if (selectedGame.name === name) {
      toggleGame('');
    }
    else {
      toggleGame({ name });
      boxGame(box);
      manualGame(manual);
      physicalGame(physical);
      dematGame(demat);
      newGameDescription(description);
    }
  };
  const handleChangeFinishedGame = () => {
    finishedGame(!finished);
    updateGame();
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  const handleChangeBoxGame = () => {
    boxGame(!box);
    updateGame();
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  const handleChangeManualGame = () => {
    manualGame(!manual);
    updateGame();
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  const handleChangePhysicalGame = () => {
    physicalGame(!physical);
    updateGame();
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  const handleChangeDematGame = () => {
    dematGame(!demat);
    updateGame();
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  const handleChangeDescription = (evt) => {
    newGameDescription(evt.target.value);
    updateGame();
  };
  const handleOver = () => {
    getGameId(id);
    finishedGame(finished);
  };
  const handleOut = () => {
    finishedGame(false);
    boxGame(false);
    manualGame(false);
    physicalGame(false);
    dematGame(false);
    newGameDescription('');
  };
  return (
    <article className="gamecard" id={id} onMouseOver={handleOver} onMouseOut={handleOut}>
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
            className="gamecard-visible-delete"
            type="button"
            onClick={() => showDeleteModal()}
          >
            <span className="remove">x </span>Supprimer
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
                  <input type="checkbox" id="box" name="box" checked={box} onChange={handleChangeBoxGame} />
                  Boîte
                </label>
              </div>
              <div>
                <label htmlFor="manual">
                  <input type="checkbox" id="manual" name="manual" checked={manual} onChange={handleChangeManualGame} />
                  Notice
                </label>
              </div>
              <div>
                <label htmlFor="game">
                  <input type="checkbox" id="game" name="game" checked={physical} onChange={handleChangePhysicalGame} />
                  Jeu
                </label>
              </div>
              <div>
                <label htmlFor="demat">
                  <input type="checkbox" id="demat" name="demat" checked={demat} onChange={handleChangeDematGame} />
                  Dématérialisé
                </label>
              </div>
            </div>
            <div>
              <p>Description :</p>
              <textarea
                className="gamecard-open-description"
                name="description"
                id="description"
                cols="15"
                rows="5"
                placeholder="Entrez votre description"
                value={newDescription}
                onChange={handleChangeDescription}
                onBlur={setTimeout(() => {
                  getGame();
                }, 1000)}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hardware: PropTypes.string.isRequired,
  developer: PropTypes.string.isRequired,
  editor: PropTypes.string.isRequired,
  release: PropTypes.number.isRequired,
  finished: PropTypes.bool.isRequired,
  box: PropTypes.bool.isRequired,
  manual: PropTypes.bool.isRequired,
  physical: PropTypes.bool.isRequired,
  demat: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  newDescription: PropTypes.string.isRequired,
  toggleGame: PropTypes.func.isRequired,
  selectedGame: PropTypes.string.isRequired,
  getGameId: PropTypes.func.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  finishedGame: PropTypes.func.isRequired,
  boxGame: PropTypes.func.isRequired,
  manualGame: PropTypes.func.isRequired,
  physicalGame: PropTypes.func.isRequired,
  dematGame: PropTypes.func.isRequired,
  newGameDescription: PropTypes.func.isRequired,
  getGame: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired,
};

export default Card;
