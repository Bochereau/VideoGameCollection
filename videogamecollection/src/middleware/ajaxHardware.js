import axios from 'axios';

import {
  GET_HARDWARE,
  getHardware,
  saveHardware,
  ADD_HARDWARE,
} from '../actions/hardware';

axios.defaults.baseURL = 'http://localhost:8626';

const ajaxHardware = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_HARDWARE: {
      // const userId = '60c9aa80a520a563aa3077ba';
      axios.get('/hardware/', {
        // userId,
      })
        .then((res) => {
          store.dispatch(saveHardware(res.data));
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
        .then(async () => {
          await getHardware();
        }).finally(async () => {
          await getHardware();
        });
      break;
    }
    default:
      next(action);
  }
};

export default ajaxHardware;
