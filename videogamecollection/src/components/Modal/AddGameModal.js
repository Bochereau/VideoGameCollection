import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modal, Button, Form } from 'react-bootstrap';

const AddGameModal = ({
  gameModalOpen,
  showGameModal,
  hardwareList,
  newGameName,
  newGameHardware,
  newGameEditor,
  newGameDeveloper,
  newGameRelease,
  currentNameValue,
  currentEditorValue,
  currentDeveloperValue,
  currentReleaseValue,
  addGame,
  getGame,
  listName,
  getWishlist,
  addWish,
}) => {
  const handleSubmitGame = (event) => {
    event.preventDefault();
    addGame();
    showGameModal(false);
    setTimeout(() => {
      getGame();
    }, 1000);
  };
  const handleSubmitWish = (event) => {
    event.preventDefault();
    addWish();
    showGameModal(false);
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
          .form-control{
            background: rgb(231, 232, 236);
          }
        `}
      </style>
      <Modal show={gameModalOpen} onHide={() => showGameModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un jeu</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={listName === 'collection' ? handleSubmitGame : handleSubmitWish}>
            <Form.Group controlId="add-name">
              <Form.Label>Nom du jeu</Form.Label>
              <Form.Control
                name="game"
                type="text"
                placeholder="Nom du jeu"
                value={currentNameValue}
                onChange={(evt) => {
                  newGameName(evt.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="add-hardware">
              <Form.Label>Console</Form.Label>
              <Form.Control onChange={(evt) => newGameHardware(evt.target.value)} name="hardware" as="select">
                <option>-- Choisissez une console --</option>
                {hardwareList.map((item) => (
                  <option value={item.name}>{item.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="add-editor">
              <Form.Label>Editeur</Form.Label>
              <Form.Control
                name="editor"
                type="text"
                placeholder="Editeur"
                value={currentEditorValue}
                onChange={(evt) => {
                  newGameEditor(evt.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="add-developer">
              <Form.Label>Developpeur</Form.Label>
              <Form.Control
                name="developer"
                type="text"
                placeholder="Developpeur"
                value={currentDeveloperValue}
                onChange={(evt) => {
                  newGameDeveloper(evt.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="add.release">
              <Form.Label>Année de sortie</Form.Label>
              <Form.Control
                name="release"
                type="text"
                placeholder="Année"
                value={currentReleaseValue}
                onChange={(evt) => {
                  newGameRelease(evt.target.value);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mr-3"
              disabled={currentNameValue === '' || currentEditorValue === '' || currentDeveloperValue === '' || currentReleaseValue === ''}
            >
              Ajouter
            </Button>
            <Button onClick={() => showGameModal()} variant="secondary">Fermer</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

AddGameModal.propTypes = {
  gameModalOpen: PropTypes.bool.isRequired,
  showGameModal: PropTypes.func.isRequired,
  hardwareList: PropTypes.arrayOf(
    PropTypes.shape({
      hardware: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  newGameName: PropTypes.func.isRequired,
  newGameHardware: PropTypes.func.isRequired,
  newGameEditor: PropTypes.func.isRequired,
  newGameDeveloper: PropTypes.func.isRequired,
  newGameRelease: PropTypes.func.isRequired,
  currentNameValue: PropTypes.string.isRequired,
  currentEditorValue: PropTypes.string.isRequired,
  currentDeveloperValue: PropTypes.string.isRequired,
  currentReleaseValue: PropTypes.string.isRequired,
  addGame: PropTypes.func.isRequired,
  getGame: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
  getWishlist: PropTypes.func.isRequired,
  addWish: PropTypes.func.isRequired,
};

export default AddGameModal;
