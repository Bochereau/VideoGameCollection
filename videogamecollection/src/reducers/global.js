import { CHANGE_VALUE, CHANGE_LIST } from '../actions/global';

const initialState = {
  name: '',
  listName: 'collection',
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
    default:
      return state;
  }
};

export default global;
