import axios from 'axios';

import {
  SIGNIN,
  ADD_USER,
  doLogin,
} from '../actions/user';

import { saveMessage } from '../actions/global';

axios.defaults.baseURL = 'http://localhost:8626';

const ajaxUser = (store) => (next) => (action) => {
  switch (action.type) {
    case ADD_USER: {
      const {
        pseudo,
        email,
        password,
        verifiedPassword,
      } = store.getState().user;

      if (password === verifiedPassword) {
        axios.post('/user/signup', {
          pseudo,
          email,
          password,
        })
          .then((res) => {
            store.dispatch(saveMessage(res.data.message));
          })
          .catch((err) => {
            store.dispatch(saveMessage(err.response.data.message));
          });
      }
      else {
        store.dispatch(saveMessage('Vos mots de passe ne correspondent pas'));
      }
      break;
    }
    case SIGNIN: {
      const { pseudo, password } = store.getState().user;
      axios.post('/user/signin', {
        pseudo,
        password,
      })
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          store.dispatch(saveMessage(res.data.message));
          store.dispatch(doLogin());
        })
        .catch((err) => {
          store.dispatch(saveMessage(err.response.data.message));
        });
      break;
    }
    default:
      next(action);
  }
};

export default ajaxUser;
