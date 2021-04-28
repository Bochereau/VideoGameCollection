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
