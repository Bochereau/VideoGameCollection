import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Form, Button } from 'react-bootstrap';

import './style.scss';

const Login = ({ saveSlug, doLogin }) => {
  const handleClick = (evt) => {
    evt.preventDefault();
    saveSlug(evt.target.getAttribute('id'));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    doLogin();
  };
  return (
    <div className="login">
      <h2>Connexion</h2>
      <Form>
        <div className="login-form">
          <Form.Group>
            <Form.Label>Pseudo</Form.Label>
            <Form.Control type="id" placeholder="Entrez votre pseudo" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control type="password" placeholder="Entrez votre mot de passe" />
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
  doLogin: PropTypes.func.isRequired,
};

export default Login;
