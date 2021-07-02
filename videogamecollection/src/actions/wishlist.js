// action to save wishlist from DB
export const SAVE_WISHLIST = 'SAVE_WISHLIST';
export const saveWishlist = (list) => ({
  type: SAVE_WISHLIST,
  list,
});

// action to open tranfer modal
export const SHOW_TRANSFER_MODAL = 'SHOW_TRANSFER_MODAL';
export const showTransferModal = () => ({
  type: SHOW_TRANSFER_MODAL,
});

/*
request in DB
*/

// action to get wishlist
export const GET_WISHLIST = 'GET_WISHLIST';
export const getWishlist = () => ({
  type: GET_WISHLIST,
});

// action to add new game in wishlist
export const ADD_WISH = 'ADD_WISH';
export const addWish = () => ({
  type: ADD_WISH,
});

// action to delete a game in wishlist
export const DELETE_WISH = 'DELETE_WISH';
export const deleteWish = () => ({
  type: DELETE_WISH,
});
