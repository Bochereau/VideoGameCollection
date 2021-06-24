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
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    addGame();
    showGameModal(false);
    setTimeout(() => {
      getGame();
    }, 1000);
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
        .form-control{
          background: #1E1F1F;
        }
        .form-control:focus{
          background: #1E1F1F;
          color: yellow;
          border: 1px solid yellow;
        }
        `}
      </style>
      <Modal show={gameModalOpen} onHide={() => showGameModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un jeu</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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
            <Button type="submit" variant="warning" className="mr-3">Ajouter</Button>
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
};

export default AddGameModal;
