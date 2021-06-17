/*
HARDWARE FRONT INTERACTION
*/

// action for openning add game modal
export const SHOW_HARDWARE_MODAL = 'SHOW_HARDWARE_MODAL';
export const showHardwareModal = () => ({
  type: SHOW_HARDWARE_MODAL,
});

// action to save filter slug
export const SAVE_HARDWARE_FILTER = 'SAVE_HARDWARE_FILTER';
export const saveHardwareFilter = (filterHardware) => ({
  type: SAVE_HARDWARE_FILTER,
  filterHardware,
});

// action to change hardware value
export const CHANGE_HARDWARE_VALUE = 'CHANGE_HARDWARE_VALUE';
export const changeHardwareValue = (hardwareValue) => ({
  type: CHANGE_HARDWARE_VALUE,
  hardwareValue,
});

// action to select constructor for new hardware
export const NEW_HARDWARE_CONSTRUCTOR = 'NEW_HARDWARE_CONSTRUCTOR';
export const newHardwareConstructor = (constructor) => ({
  type: NEW_HARDWARE_CONSTRUCTOR,
  constructor,
});

/*
HARDWARE REQUEST
*/

// action to get hardware by user id
export const GET_HARDWARE = 'GET_HARDWARE';
export const getHardware = () => ({
  type: GET_HARDWARE,
});

// action to save hardware in store
export const SAVE_HARDWARE = 'SAVE_HARDWARE';
export const saveHardware = (hardwareList) => ({
  type: SAVE_HARDWARE,
  hardwareList,
});

// action to add new hardware
export const ADD_HARDWARE = 'ADD_HARDWARE';
export const addHardware = () => ({
  type: ADD_HARDWARE,
});
