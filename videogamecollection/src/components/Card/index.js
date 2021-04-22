import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import trash from '../../assets/images/icons/trash.png';
import upArrow from '../../assets/images/icons/up_arrow.png';
import downArrow from '../../assets/images/icons/down_arrow.png';

import image from '../../assets/images/icons/image.svg';

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
  showDetails,
  showed,
  getGameId,
  gameId,
}) => {
  const moreDetails = async () => {
    getGameId(id);
    if (gameId === id) {
      showDetails();
    }
  };
  const handleChange = (evt) => {
    evt.preventDefault();
    console.log(evt.target.checked);
  };
  return (
    <article className="card" id={id}>
      <div className="card-visible">
        <h3 className="card-visible-title">{name}</h3>
        <div className="card-visible-display">
          <div className="card-visible-details">
            <div className="card-visible-hardware">
              <p>Console :</p>
              <h4>{hardware}</h4>
            </div>
            <div className="card-visible-editor">
              <p>Développeur :</p>
              <h4>{developer}</h4>
            </div>
            <div className="card-visible-editor">
              <p>Editeur :</p>
              <h4>{editor}</h4>
            </div>
            <div className="card-visible-release">
              <p>Année de sortie :</p>
              <h4>{release}</h4>
            </div>
          </div>
          <div className="card-visible-check">
            <label htmlFor="finished">
              Terminé :<input type="checkbox" id="finished" name="finished" checked={finished} onChange={handleChange} />
            </label>
            <img src={trash} alt="Supprimer" />
          </div>
        </div>
        <p
          className="card-visible-more"
          onClick={moreDetails}
        >
          Plus de details <img src={gameId === id && showed ? `${upArrow}` : `${downArrow}`} alt="arrow" />
        </p>
      </div>
      <div className={gameId === id && showed ? 'card-open' : 'card-hidden'}>
        <img className="card-open-image" src={image} alt={`Jaquette de ${name}`} />
        <div className="card-open-info">
          <div className="card-open-checkboxes">
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
          <textarea className="card-open-description" name="description" id="description" cols="70" rows="4" placeholder="Description" />
        </div>
      </div>
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
  showDetails: PropTypes.func.isRequired,
  showed: PropTypes.bool.isRequired,
  getGameId: PropTypes.func.isRequired,
  gameId: PropTypes.number,
};

Card.defaultProps = {
  gameId: null,
};

export default Card;
