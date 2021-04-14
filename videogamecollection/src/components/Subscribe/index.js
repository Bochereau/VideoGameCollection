import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Form, Button } from 'react-bootstrap';

import './style.scss';

const Subscribe = ({ saveSlug }) => {
  const handleClick = (evt) => {
    evt.preventDefault();
    saveSlug(evt.target.getAttribute('id'));
  };
  return (
    <div className="subscribe">
      <h2>Inscription</h2>
      <Form>
        <div className="subscribe-form">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="id" placeholder="Entrez votre email" />
            <Form.Text>
              Votre email sert uniquement a confirmer votre inscription.
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Pseudo</Form.Label>
            <Form.Control type="id" placeholder="Entrez votre pseudo" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control type="password" placeholder="Entrez votre mot de passe" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Confirmez votre mot de passe</Form.Label>
            <Form.Control type="password" placeholder="Confirmez votre mot de passe" />
          </Form.Group>
        </div>
        <Button type="submit">
          S'inscrire
        </Button>
      </Form>
      <div className="subscribe-redirect">
        <p
          id="login"
          onClick={handleClick}
        >
          Vous avez déjà un compte ? cliquez ici
        </p>
      </div>
    </div>
  );
};

Subscribe.propTypes = {
  saveSlug: PropTypes.func.isRequired,
};

export default Subscribe;
