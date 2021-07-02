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
  BOX_GAME,
  MANUAL_GAME,
  PHYSICAL_GAME,
  DEMAT_GAME,
  NEW_GAME_DESCRIPTION,
  GET_GAME_ID,
  SAVE_GAME_LIST,
  SAVE_SEARCH,
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
  gameId: '',
  finished: false,
  box: false,
  manual: false,
  physical: false,
  demat: false,
  newDescription: '',
  search: '',
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
    case BOX_GAME:
      return {
        ...state,
        box: action.box,
      };
    case MANUAL_GAME:
      return {
        ...state,
        manual: action.manual,
      };
    case PHYSICAL_GAME:
      return {
        ...state,
        physical: action.physical,
      };
    case DEMAT_GAME:
      return {
        ...state,
        demat: action.demat,
      };
    case NEW_GAME_DESCRIPTION:
      return {
        ...state,
        newDescription: action.description,
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
    case SAVE_SEARCH:
      return {
        ...state,
        search: action.search,
      };
    default:
      return state;
  }
};

export default game;
