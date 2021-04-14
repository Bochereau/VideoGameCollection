import { DO_LOGIN, LOGOUT } from '../actions/user';

const initialState = {
  logged: false,
};

const user = (state = initialState, action = {}) => {
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        logged: !state.logged,
      };
    case LOGOUT:
      return {
        ...state,
        logged: false,
      };
    default:
      return state;
  }
};

export default user;
