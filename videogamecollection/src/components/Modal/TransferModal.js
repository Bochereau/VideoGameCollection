import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modal, Button } from 'react-bootstrap';

import './style.scss';

const DeleteModal = ({
  transferModalOpen,
  showTransferModal,
  addGame,
  deleteWish,
  gameName,
  newGameName,
  newGameHardware,
  newGameEditor,
  newGameDeveloper,
  newGameRelease,
  getWishlist,
}) => {
  const handleOpen = async () => {
    newGameName('');
    newGameHardware('');
    newGameEditor('');
    newGameDeveloper('');
    newGameRelease('');
    showTransferModal(false);
  };
  const handleClick = async () => {
    addGame();
    showTransferModal(false);
    await newGameName('');
    await newGameHardware('');
    await newGameEditor('');
    await newGameDeveloper('');
    await newGameRelease('');
    await deleteWish();
    setTimeout(() => {
      getWishlist();
    }, 1000);
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
      <Modal show={transferModalOpen} onHide={handleOpen} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Ajouter {gameName} à la collection ?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <Button onClick={handleClick} type="submit" variant="primary" className="mr-3">Ajouter</Button>
          <Button onClick={handleOpen} variant="secondary">Fermer</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

DeleteModal.propTypes = {
  transferModalOpen: PropTypes.bool.isRequired,
  showTransferModal: PropTypes.func.isRequired,
  addGame: PropTypes.func.isRequired,
  deleteWish: PropTypes.func.isRequired,
  gameName: PropTypes.string.isRequired,
  newGameName: PropTypes.func.isRequired,
  newGameHardware: PropTypes.func.isRequired,
  newGameEditor: PropTypes.func.isRequired,
  newGameDeveloper: PropTypes.func.isRequired,
  newGameRelease: PropTypes.func.isRequired,
  getWishlist: PropTypes.func.isRequired,
};

export default DeleteModal;
