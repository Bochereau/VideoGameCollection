import {
  GET_GAME_ID,
  SHOW_DETAILS,
  SHOW_GAME_MODAL,
  ADD_VIDEOGAME,
  SAVE_GAME_FILTER,
  FINISHED_GAME,
} from '../actions/game';

import videogames from '../datas/videogames';

const initialState = {
  gameId: null,
  showed: false,
  gameModalOpen: false,
  videogamesList: videogames,
  filterGame: 'allgames',
  finished: null,
};

const game = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_GAME_ID:
      return {
        ...state,
        gameId: action.gameId,
      };
    case SHOW_DETAILS:
      return {
        ...state,
        showed: !state.showed,
      };
    case SHOW_GAME_MODAL:
      return {
        ...state,
        gameModalOpen: !state.gameModalOpen,
      };
    case ADD_VIDEOGAME:
      return {
        ...state,
        videogamesList: [...state.videogamesList, action.newVideogame],
      };
    case SAVE_GAME_FILTER:
      return {
        ...state,
        filterGame: action.filterGame,
      };
    case FINISHED_GAME:
      return {
        ...state,
        // [videogamesList.gameId]: [...!state.videogamesList.finished],
      };
    default:
      return state;
  }
};

export default game;
