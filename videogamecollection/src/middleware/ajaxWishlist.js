import axios from 'axios';

import {
  GET_WISHLIST,
  saveWishlist,
  ADD_WISH,
  DELETE_WISH,
} from '../actions/wishlist';

import { saveMessage } from '../actions/global';

axios.defaults.baseURL = 'http://localhost:8626';

const ajaxGame = (store) => (next) => (action) => {
  switch (action.type) {
    case ADD_WISH: {
      const token = localStorage.getItem('token');
      const {
        gameName,
        gameHardware,
        gameEditor,
        gameDeveloper,
        gameRelease,
      } = store.getState().game;
      axios.post('/wishlist/add', {
        name: gameName,
        hardware: gameHardware,
        editor: gameEditor,
        developer: gameDeveloper,
        release: gameRelease,
      },
      {
        headers: { Authorization: `bearer ${token}` },
      })
        .then((res) => {
          store.dispatch(saveMessage(res.data.name));
        });
      break;
    }
    case DELETE_WISH: {
      const token = localStorage.getItem('token');
      const { gameId } = store.getState().game;
      axios.delete(`/wishlist/${gameId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      break;
    }
    case GET_WISHLIST: {
      const token = localStorage.getItem('token');
      axios.get('/wishlist/', {
        headers: { Authorization: `bearer ${token}` },
      })
        .then((res) => {
          store.dispatch(saveWishlist(res.data));
        });
      break;
    }
    default:
      next(action);
  }
};

export default ajaxGame;
