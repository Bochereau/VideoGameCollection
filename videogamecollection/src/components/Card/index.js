import React from 'react';

import './style.scss';

const Card = () => (
  <article className="card">
    <div className="card-visible">
      <h3 className="card-visible-title">Streets of Rage 2</h3>
      <div className="card-visible-display">
        <div className="card-visible-details">
          <div className="card-visible-hardware">
            <p>Console :</p>
            <h4>Megadrive</h4>
          </div>
          <div className="card-visible-editor">
            <p>Editeur :</p>
            <h4>Sega</h4>
          </div>
          <div className="card-visible-release">
            <p>Année de sortie</p>
            <h4>1992</h4>
          </div>
        </div>
        <div className="card-visible-check">
          <label htmlFor="finished">
            Terminé : <input type="checkbox" id="finished" name="finished" />
          </label>
        </div>
      </div>
      <p className="card-visible-more"> Plus de details &#9660;</p>
    </div>
    <div className="card-hidden">
      <p>description avancée</p>
    </div>
  </article>
);

export default Card;
