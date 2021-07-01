import { SAVE_WISHLIST } from '../actions/wishlist';

const initialState = {
  list: [],
};

const wishlist = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_WISHLIST:
      return {
        ...state,
        list: action.list,
      };
    default:
      return state;
  }
};

export default wishlist;
