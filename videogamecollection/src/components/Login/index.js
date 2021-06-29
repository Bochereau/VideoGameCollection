import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Form, Button } from 'react-bootstrap';

import './style.scss';

const Login = ({
  saveSlug,
  signin,
  pseudoValue,
  changePseudoValue,
  passwordValue,
  changePasswordValue,
}) => {
  const handleClick = (evt) => {
    evt.preventDefault();
    saveSlug(evt.target.getAttribute('id'));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    signin();
  };
  return (
    <div className="login">
      <h2>Connexion</h2>
      <Form>
        <div className="login-form">
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
          </Form.Group>
        </div>
        <Button
          type="submit"
          className="mt-3"
          variant="warning"
          onClick={handleSubmit}
        >
          Se connecter
        </Button>
      </Form>
      <div className="login-redirect">
        <p
          id="subscribe"
          onClick={handleClick}
        >
          Pas encore inscrit ? cliquez ici
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  saveSlug: PropTypes.func.isRequired,
  signin: PropTypes.func.isRequired,
  pseudoValue: PropTypes.string.isRequired,
  changePseudoValue: PropTypes.func.isRequired,
  passwordValue: PropTypes.string.isRequired,
  changePasswordValue: PropTypes.func.isRequired,
};

export default Login;
