import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modal, Button, Form } from 'react-bootstrap';

const Modale = ({
  modalOpen,
  showModal,
  changeCurrentValue,
  currentValue,
  hardwareList,
}) => (
  <Modal show={modalOpen} onHide={() => showModal()} centered>
    <Modal.Header closeButton>
      <Modal.Title>Ajouter un jeu</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form>
        <Form.Group controlId="add-name">
          <Form.Label>Nom du jeu</Form.Label>
          <Form.Control
            name="game"
            type="text"
            placeholder="Nom du jeu"
            value={currentValue}
            onChange={(evt) => {
              changeCurrentValue(evt.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="add-hardware">
          <Form.Label>Console</Form.Label>
          <Form.Control name="hardware" as="select">
            {hardwareList.map((item) => (
              <option value="Megadrive">{item.hardware}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="add-editor">
          <Form.Label>Editeur</Form.Label>
          <Form.Control
            name="editor"
            type="text"
            placeholder="Editeur"
            value={currentValue}
            onChange={(evt) => {
              changeCurrentValue(evt.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="add-developer">
          <Form.Label>Developpeur</Form.Label>
          <Form.Control
            name="developer"
            type="text"
            placeholder="Developpeur"
            value={currentValue}
            onChange={(evt) => {
              changeCurrentValue(evt.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="add.release">
          <Form.Label>Année de sortie</Form.Label>
          <Form.Control
            name="release"
            type="text"
            placeholder="Année"
            value={currentValue}
            onChange={(evt) => {
              changeCurrentValue(evt.target.value);
            }}
          />
        </Form.Group>
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="primary">Ajouter</Button>
      <Button onClick={() => showModal()} variant="secondary">Fermer</Button>
    </Modal.Footer>
  </Modal>
);

Modale.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  changeCurrentValue: PropTypes.func.isRequired,
  currentValue: PropTypes.string.isRequired,
  hardwareList: PropTypes.arrayOf(
    PropTypes.shape({
      hardware: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default Modale;
