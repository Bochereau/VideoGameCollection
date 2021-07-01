import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Form, Button } from 'react-bootstrap';

import './style.scss';

const Subscribe = ({
  saveSlug,
  emailValue,
  changeEmailValue,
  pseudoValue,
  changePseudoValue,
  passwordValue,
  changePasswordValue,
  verifiedPasswordValue,
  changeVerifiedPasswordValue,
  addUser,
}) => {
  const handleClick = (evt) => {
    evt.preventDefault();
    saveSlug(evt.target.getAttribute('id'));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    addUser();
  };
  return (
    <div className="subscribe">
      <h2>Inscription</h2>
      <Form>
        <div className="subscribe-form">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="id"
              placeholder="Entrez votre email"
              value={emailValue}
              onChange={(evt) => changeEmailValue(evt.target.value)}
            />
            <Form.Text>
              Votre email sert uniquement a confirmer votre inscription.
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Pseudo</Form.Label>
            <Form.Control
              type="id"
              placeholder="Entrez votre pseudo"
              value={pseudoValue}
              onChange={(evt) => changePseudoValue(evt.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez votre mot de passe"
              value={passwordValue}
              onChange={(evt) => changePasswordValue(evt.target.value)}
            />
            <Form.Text>
              Votre mot de passe doit contenir au moins 8 caractères.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Confirmez votre mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={verifiedPasswordValue}
              onChange={(evt) => changeVerifiedPasswordValue(evt.target.value)}
            />
          </Form.Group>
        </div>
        <Button
          type="submit"
          className="mt-3"
          variant="primary"
          onClick={handleSubmit}
        >
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
  emailValue: PropTypes.string.isRequired,
  changeEmailValue: PropTypes.func.isRequired,
  pseudoValue: PropTypes.string.isRequired,
  changePseudoValue: PropTypes.func.isRequired,
  passwordValue: PropTypes.string.isRequired,
  changePasswordValue: PropTypes.func.isRequired,
  verifiedPasswordValue: PropTypes.string.isRequired,
  changeVerifiedPasswordValue: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};

export default Subscribe;
