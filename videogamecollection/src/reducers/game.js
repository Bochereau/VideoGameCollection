import {
  TOGGLE_GAME,
  SHOW_GAME_MODAL,
  SHOW_DELETE_MODAL,
  SAVE_GAME_FILTER,
  NEW_GAME_NAME,
  NEW_GAME_HARDWARE,
  NEW_GAME_EDITOR,
  NEW_GAME_DEVELOPER,
  NEW_GAME_RELEASE,
  FINISHED_GAME,
  GET_GAME_ID,
  SAVE_GAME_LIST,
} from '../actions/game';

// import videogames from '../datas/videogames';
import wishlist from '../datas/wishlist';

const initialState = {
  selectedGame: '',
  gameModalOpen: false,
  deleteModalOpen: false,
  videogamesList: [],
  wishlist,
  filterGame: 'allgames',
  gameName: '',
  gameHardware: '',
  gameEditor: '',
  gameDeveloper: '',
  gameRelease: '',
  gemeId: '',
  finished: false,
};

const game = (state = initialState, action = {}) => {
  switch (action.type) {
    case TOGGLE_GAME:
      return {
        ...state,
        selectedGame: action.game,
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
    case SHOW_DELETE_MODAL:
      return {
        ...state,
        deleteModalOpen: !state.deleteModalOpen,
      };
    case SAVE_GAME_FILTER:
      return {
        ...state,
        filterGame: action.filterGame,
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
    case FINISHED_GAME:
      return {
        ...state,
        finished: action.finished,
      };
    case GET_GAME_ID:
      return {
        ...state,
        gameId: action.gameId,
      };
    case SAVE_GAME_LIST:
      return {
        ...state,
        videogamesList: action.gameList,
      };
    default:
      return state;
  }
};

export default game;
