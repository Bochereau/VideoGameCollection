import {
  DO_LOGIN,
  LOGOUT,
  CHANGE_PSEUDO_VALUE,
  CHANGE_EMAIL_VALUE,
  CHANGE_PASSWORD_VALUE,
  CHANGE_VERIFIED_PASSWORD_VALUE,
} from '../actions/user';

const initialState = {
  logged: false,
  pseudo: '',
  email: '',
  password: '',
  verifiedPassword: '',
};

const user = (state = initialState, action = {}) => {
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        logged: true,
        password: '',
      };
    case LOGOUT:
      return {
        ...state,
        logged: false,
        pseudo: '',
      };
    case CHANGE_PSEUDO_VALUE:
      return {
        ...state,
        pseudo: action.pseudoValue,
      };
    case CHANGE_EMAIL_VALUE:
      return {
        ...state,
        email: action.emailValue,
      };
    case CHANGE_PASSWORD_VALUE:
      return {
        ...state,
        password: action.passwordValue,
      };
    case CHANGE_VERIFIED_PASSWORD_VALUE:
      return {
        ...state,
        verifiedPassword: action.verifiedPasswordValue,
      };
    default:
      return state;
  }
};

export default user;
