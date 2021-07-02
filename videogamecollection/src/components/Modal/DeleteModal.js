import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modal, Button } from 'react-bootstrap';

import './style.scss';
import videogameName from '../../helper';

const DeleteModal = ({
  deleteModalOpen,
  showDeleteModal,
  deleteGame,
  deleteWish,
  listName,
  videogamesList,
  wishList,
  gameId,
  getGame,
  getWishlist,
}) => {
  const handleClick = async () => {
    if (listName === 'collection') {
      deleteGame();
      await getGame();
    }
    if (listName === 'wishlist') {
      deleteWish();
      await getWishlist();
    }
    showDeleteModal();
  };
  return (
    <>
      <style type="text/css">
        {`
        .modal {
          color: rgb(70, 135, 187);
        }
        .modal-header{
          background: rgb(231, 232, 236);
        }
        .modal-body{
          background: rgb(231, 232, 236);
        }
        `}
      </style>
      <Modal show={deleteModalOpen} onHide={() => showDeleteModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Supprimer définitivement : {listName === 'collection'
            ? videogameName(videogamesList, gameId) : videogameName(wishList, gameId)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <Button onClick={handleClick} type="submit" variant="primary" className="mr-3">Supprimer</Button>
          <Button onClick={() => showDeleteModal()} variant="secondary">Fermer</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

DeleteModal.propTypes = {
  deleteModalOpen: PropTypes.bool.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  deleteWish: PropTypes.func.isRequired,
  deleteGame: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  videogamesList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      hardware: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      editor: PropTypes.string.isRequired,
      release: PropTypes.number.isRequired,
      finished: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  wishList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      hardware: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      editor: PropTypes.string.isRequired,
      release: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
  getGame: PropTypes.func.isRequired,
  getWishlist: PropTypes.func.isRequired,
};

export default DeleteModal;
