import { SAVE_WISHLIST, SHOW_TRANSFER_MODAL } from '../actions/wishlist';

const initialState = {
  list: [],
  transferModalOpen: false,
};

const wishlist = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_WISHLIST:
      return {
        ...state,
        list: action.list,
      };
    case SHOW_TRANSFER_MODAL:
      return {
        ...state,
        transferModalOpen: !state.transferModalOpen,
      };
    default:
      return state;
  }
};

export default wishlist;
