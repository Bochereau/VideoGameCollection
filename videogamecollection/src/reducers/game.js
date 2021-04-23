import {
  GET_GAME_ID,
  SHOW_DETAILS,
  SHOW_GAME_MODAL,
  SHOW_HARDWARE_MODAL,
  ADD_VIDEOGAME,
  SAVE_GAME_FILTER,
  SAVE_HARDWARE_FILTER,
  FINISHED_GAME,
} from '../actions/game';

import videogames from '../datas/videogames';
import hardware from '../datas/hardware';

const initialState = {
  gameId: null,
  showed: false,
  gameModalOpen: false,
  hardwareModalOpen: false,
  videogamesList: videogames,
  filterGame: 'allgames',
  filterHardware: 'allhardware',
  finished: null,
  hardwareList: hardware,
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
    case SHOW_HARDWARE_MODAL:
      return {
        ...state,
        hardwareModalOpen: !state.hardwareModalOpen,
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
    case SAVE_HARDWARE_FILTER:
      return {
        ...state,
        filterHardware: action.filterHardware,
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
