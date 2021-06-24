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
  videogamesList,
  gameId,
  getGame,
}) => {
  const handleClick = async () => {
    deleteGame();
    showDeleteModal();
    await getGame();
  };
  return (
    <>
      <style type="text/css">
        {`
        .modal {
          color: yellow;
        }
        .modal-header{
          background: #1E1F1F;
        }
        .modal-body{
          background: #1E1F1F;
        }
        .btn-warning{
          background: yellow;
        }
        `}
      </style>
      <Modal show={deleteModalOpen} onHide={() => showDeleteModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Supprimer définitivement : {videogameName(videogamesList, gameId)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <Button onClick={handleClick} type="submit" variant="warning" className="mr-3">Supprimer</Button>
          <Button onClick={() => showDeleteModal()} variant="secondary">Fermer</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

DeleteModal.propTypes = {
  deleteModalOpen: PropTypes.bool.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  deleteGame: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
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
  getGame: PropTypes.func.isRequired,
};

export default DeleteModal;
