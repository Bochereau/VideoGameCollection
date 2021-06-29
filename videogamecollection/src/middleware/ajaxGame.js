import axios from 'axios';

import {
  GET_GAME,
  saveGameList,
  ADD_GAME,
  UPDATE_GAME,
  DELETE_GAME,
} from '../actions/game';

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
      });
      break;
    }
    case UPDATE_GAME: {
      const token = localStorage.getItem('token');
      const { gameId, finished } = store.getState().game;
      axios.put(`/videogame/${gameId}`, {
        finished,
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
