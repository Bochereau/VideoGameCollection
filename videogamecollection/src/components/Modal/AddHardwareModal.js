import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modal, Button, Form } from 'react-bootstrap';

import company from '../../datas/company';

const AddHardwareModal = ({
  hardwareModalOpen,
  showHardwareModal,
  changeHardwareValue,
  currentHardwareValue,
  newHardwareConstructor,
  addHardware,
  companySelected,
  getHardware,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    addHardware();
    showHardwareModal(false);
    setTimeout(() => {
      getHardware();
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
        .btn-warning{
          background: yellow;
        }
        `}
      </style>
      <Modal show={hardwareModalOpen} onHide={() => showHardwareModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une console</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="add-name">
              <Form.Label>Nom de la console</Form.Label>
              <Form.Control
                name="hardware"
                type="text"
                placeholder="Nom de la console"
                value={currentHardwareValue}
                onChange={(evt) => {
                  changeHardwareValue(evt.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="add-hardware">
              <Form.Label>Constructeur</Form.Label>
              <Form.Control onChange={(evt) => newHardwareConstructor(evt.target.value)} name="hardware" as="select">
                <option value="">-- Choississez un constructeur --</option>
                {company.map((constructor) => (
                  <option key={constructor.id} value={constructor.name}>{constructor.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              variant="warning"
              type="submit"
              disabled={companySelected === '' || currentHardwareValue === ''}
            >
              Ajouter
            </Button>
            <Button className="ml-2" onClick={() => showHardwareModal()} variant="secondary">Fermer</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

AddHardwareModal.propTypes = {
  hardwareModalOpen: PropTypes.bool.isRequired,
  showHardwareModal: PropTypes.func.isRequired,
  changeHardwareValue: PropTypes.func.isRequired,
  currentHardwareValue: PropTypes.string.isRequired,
  newHardwareConstructor: PropTypes.string.isRequired,
  addHardware: PropTypes.func.isRequired,
  companySelected: PropTypes.string.isRequired,
  getHardware: PropTypes.func.isRequired,
};

export default AddHardwareModal;
