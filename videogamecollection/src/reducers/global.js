import { CHANGE_VALUE, CHANGE_LIST, OPEN_ASIDE } from '../actions/global';

const initialState = {
  name: '',
  listName: 'collection',
  toggleAside: false,
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
    case CHANGE_LIST:
      return {
        ...state,
        listName: action.listValue,
      };
    case OPEN_ASIDE:
      return {
        ...state,
        toggleAside: !state.toggleAside,
      };
    default:
      return state;
  }
};

export default global;
