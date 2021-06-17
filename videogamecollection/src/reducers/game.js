import {
  GET_GAME_ID,
  SHOW_DETAILS,
  SHOW_GAME_MODAL,
  ADD_VIDEOGAME,
  SAVE_GAME_FILTER,
  FINISHED_GAME,
  NEW_GAME_NAME,
  NEW_GAME_HARDWARE,
  NEW_GAME_EDITOR,
  NEW_GAME_DEVELOPER,
  NEW_GAME_RELEASE,
} from '../actions/game';

import videogames from '../datas/videogames';
import wishlist from '../datas/wishlist';

const initialState = {
  gameId: null,
  showed: false,
  gameModalOpen: false,
  videogamesList: videogames,
  wishlist,
  filterGame: 'allgames',
  finished: null,
  gameName: '',
  gameHardware: '',
  gameEditor: '',
  gameDeveloper: '',
  gameRelease: '',
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
        gameName: '',
        gameHardware: '',
        gameEditor: '',
        gameDeveloper: '',
        gameRelease: '',
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
    case NEW_GAME_NAME:
      return {
        ...state,
        gameName: action.nameValue,
      };
    case NEW_GAME_HARDWARE:
      return {
        ...state,
        gameHardware: action.hardware,
      };
    case NEW_GAME_EDITOR:
      return {
        ...state,
        gameEditor: action.editorValue,
      };
    case NEW_GAME_DEVELOPER:
      return {
        ...state,
        gameDeveloper: action.developerValue,
      };
    case NEW_GAME_RELEASE:
      return {
        ...state,
        gameRelease: action.releaseValue,
      };
    default:
      return state;
  }
};

export default game;
