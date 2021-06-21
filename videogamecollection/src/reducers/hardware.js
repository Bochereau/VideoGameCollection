import {
  SHOW_HARDWARE_MODAL,
  SAVE_HARDWARE_FILTER,
  CHANGE_HARDWARE_VALUE,
  NEW_HARDWARE_CONSTRUCTOR,
  SAVE_HARDWARE,
  TOGGLE_COMPANY,
} from '../actions/hardware';

// import hardware from '../datas/hardware';

const initialState = {
  hardwareModalOpen: false,
  filterHardware: 'allhardware',
  hardwareList: [],
  newHardware: '',
  newHardwareCompany: '',
  selectedCompany: '',
};

const game = (state = initialState, action = {}) => {
  switch (action.type) {
    case SHOW_HARDWARE_MODAL:
      return {
        ...state,
        hardwareModalOpen: !state.hardwareModalOpen,
        newHardware: '',
        newHardwareCompany: '',
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
        newHardwareCompany: action.constructor,
      };
    case SAVE_HARDWARE:
      return {
        ...state,
        hardwareList: action.hardwareList,
      };
    case TOGGLE_COMPANY:
      return {
        ...state,
        selectedCompany: action.company,
      };
    default:
      return state;
  }
};

export default game;
