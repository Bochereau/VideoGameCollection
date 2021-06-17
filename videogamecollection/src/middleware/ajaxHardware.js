import axios from 'axios';

import {
  GET_HARDWARE,
  saveHardware,
  ADD_HARDWARE,
  showHardwareModal,
} from '../actions/hardware';

axios.defaults.baseURL = 'http://localhost:8626';

const ajaxHardware = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_HARDWARE: {
      const userId = '60c9aa80a520a563aa3077ba';
      axios.get('/hardware/', {
        userId,
      })
        .then((res) => {
          console.log(res.data);
          store.dispatch(saveHardware(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
      break;
    }
    case ADD_HARDWARE: {
      const userId = '60c9aa80a520a563aa3077ba';
      const { newHardware, newHardwareCompany } = store.getState().hardware;
      axios.post('/hardware/add', {
        name: newHardware,
        company: newHardwareCompany,
        userId,
      })
        .then((res) => {
          showHardwareModal();
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
      break;
    }
    default:
      next(action);
  }
};

export default ajaxHardware;
