import {
  SHOW_HARDWARE_MODAL,
  SAVE_HARDWARE_FILTER,
  CHANGE_HARDWARE_VALUE,
  NEW_HARDWARE_CONSTRUCTOR,
} from '../actions/hardware';

import hardware from '../datas/hardware';

const initialState = {
  hardwareModalOpen: false,
  filterHardware: 'allhardware',
  hardwareList: hardware,
  newHardware: '',
  newHardwareConstructor: '',
};

const game = (state = initialState, action = {}) => {
  switch (action.type) {
    case SHOW_HARDWARE_MODAL:
      return {
        ...state,
        hardwareModalOpen: !state.hardwareModalOpen,
      };
    case SAVE_HARDWARE_FILTER:
      return {
        ...state,
        filterHardware: action.filterHardware,
      };
    case CHANGE_HARDWARE_VALUE:
      return {
        ...state,
        newHardware: action.hardwareValue,
      };
    case NEW_HARDWARE_CONSTRUCTOR:
      return {
        ...state,
        newHardwareConstructor: action.constructor,
      };
    default:
      return state;
  }
};

export default game;
