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
      const userId = '60c9aa80a520a563aa3077ba';
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
        userId,
      });
      break;
    }
    case UPDATE_GAME: {
      const { gameId, finished } = store.getState().game;
      axios.put(`/videogame/${gameId}`, {
        finished,
      });
      break;
    }
    case DELETE_GAME: {
      const { gameId } = store.getState().game;
      axios.delete(`/videogame/${gameId}`);
      break;
    }
    case GET_GAME: {
      // const userId = '60c9aa80a520a563aa3077ba';
      axios.get('/videogame/', {
        // userId,
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
