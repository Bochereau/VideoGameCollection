import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Wishlist = ({ wishlist }) => (
  <div className="wishlist">
    {wishlist.map((game) => (
      <article className="wishlist-item" id={game.id}>
        <h3 className="wishlist-item-title">{game.name}</h3>
        <div className="wishlist-item-hardware">
          <p className="wishlist-item-hardware-title">Console :</p>
          <h4 className="wishlist-item-hardware-name">{game.hardware}</h4>
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
    }).isRequired,
  ).isRequired,
};

export default Wishlist;
