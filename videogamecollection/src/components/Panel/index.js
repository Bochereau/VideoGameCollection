import React from 'react';

import './style.scss';

const Panel = () => (
  <div className="panel">
    <h2 className="panel-title">Vos consoles</h2>
    <button className="panel-button-add" type="button"><span className="add">+</span> Ajouter une console</button>
    <button className="panel-button active" type="button">Toutes les consoles (25)</button>
    <button className="panel-button" type="button">Megadrive (5)</button>
    <button className="panel-button" type="button">Playstation (5)</button>
  </div>
);

export default Panel;
