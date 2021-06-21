// Action change value (email, password)
export const CHANGE_VALUE = 'CHANGE_VALUE';
export const changeValue = (newValue, name) => ({
  type: CHANGE_VALUE,
  newValue,
  name,
});

// Action to switch between collection and wishlist
export const CHANGE_LIST = 'CHANGE_LIST';
export const changeList = (listValue) => ({
  type: CHANGE_LIST,
  listValue,
});

// Action to open aside menu
export const OPEN_ASIDE = 'OPEN_ASIDE';
export const openAside = () => ({
  type: OPEN_ASIDE,
});
