import { GET_GAME_ID, SHOW_DETAILS } from '../actions/game';

const initialState = {
  gameId: null,
  showed: false,
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
    default:
      return state;
  }
};

export default game;
