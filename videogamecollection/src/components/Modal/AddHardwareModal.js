import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modal, Button, Form } from 'react-bootstrap';

import constructors from '../../datas/constructor';

const AddHardwareModal = ({
  hardwareModalOpen,
  showHardwareModal,
  changeCurrentValue,
  currentValue,
}) => (
  <Modal show={hardwareModalOpen} onHide={() => showHardwareModal()} centered>
    <Modal.Header closeButton>
      <Modal.Title>Ajouter une console</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form>
        <Form.Group controlId="add-name">
          <Form.Label>Nom de la console</Form.Label>
          <Form.Control
            name="hardware"
            type="text"
            placeholder="Nom de la console"
            value={currentValue}
            onChange={(evt) => {
              changeCurrentValue(evt.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="add-hardware">
          <Form.Label>Constructeur</Form.Label>
          <Form.Control name="hardware" as="select">
            <option value="">-- Choississez un constructeur --</option>
            {constructors.map((brand) => (
              <option key={brand.id} value={brand.constructor}>{brand.constructor}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="primary">Ajouter</Button>
      <Button onClick={() => showHardwareModal()} variant="secondary">Fermer</Button>
    </Modal.Footer>
  </Modal>
);

AddHardwareModal.propTypes = {
  hardwareModalOpen: PropTypes.bool.isRequired,
  showHardwareModal: PropTypes.func.isRequired,
  changeCurrentValue: PropTypes.func.isRequired,
  currentValue: PropTypes.string.isRequired,
};

export default AddHardwareModal;
