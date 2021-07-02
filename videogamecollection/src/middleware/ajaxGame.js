import axios from 'axios';

import {
  GET_GAME,
  saveGameList,
  ADD_GAME,
  UPDATE_GAME,
  DELETE_GAME,
} from '../actions/game';

import { saveMessage } from '../actions/global';

axios.defaults.baseURL = 'http://localhost:8626';

const ajaxGame = (store) => (next) => (action) => {
  switch (action.type) {
    case ADD_GAME: {
      const token = localStorage.getItem('token');
      const {
        gameName,
        gameHardware,
        gameEditor,
        gameDeveloper,
        gameRelease,
      } = store.getState().game;
      axios.post('/videogame/add', {
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
          console.log(res);
          store.dispatch(saveMessage(res.data.message));
        });
      break;
    }
    case UPDATE_GAME: {
      const token = localStorage.getItem('token');
      const {
        gameId,
        finished,
        box,
        manual,
        physical,
        demat,
        newDescription,
      } = store.getState().game;
      axios.put(`/videogame/${gameId}`, {
        finished,
        box,
        manual,
        physical,
        demat,
        description: newDescription,
      },
      {
        headers: { Authorization: `bearer ${token}` },
      });
      break;
    }
    case DELETE_GAME: {
      const token = localStorage.getItem('token');
      const { gameId } = store.getState().game;
      axios.delete(`/videogame/${gameId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      break;
    }
    case GET_GAME: {
      const token = localStorage.getItem('token');
      axios.get('/videogame/', {
        headers: { Authorization: `bearer ${token}` },
      })
        .then((res) => {
          store.dispatch(saveGameList(res.data));
        });
      break;
    }
    default:
      next(action);
  }
};

export default ajaxGame;
