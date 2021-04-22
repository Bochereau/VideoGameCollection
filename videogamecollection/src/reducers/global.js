import { CHANGE_VALUE } from '../actions/global';

const initialState = {
  name: '',
};

const global = (state = initialState, action = {}) => {
  switch (action.type) {
    case CHANGE_VALUE:
      return {
        ...state,
        // action.name contient soit "firstname", "lastname", "message", ...
        // cela revient à écrire par exemple ['email'] ou bien directement email
        [action.name]: action.newValue,
      };
    default:
      return state;
  }
};

export default global;
