import axios from 'axios';

import {
  GET_HARDWARE,
  saveHardware,
  ADD_HARDWARE,
} from '../actions/hardware';

import { saveMessage } from '../actions/global';

axios.defaults.baseURL = 'http://localhost:8626';

const ajaxHardware = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_HARDWARE: {
      const token = localStorage.getItem('token');
      axios.get('/hardware/', {
        headers: { Authorization: `bearer ${token}` },
      })
        .then((res) => {
          store.dispatch(saveHardware(res.data));
        });
      break;
    }
    case ADD_HARDWARE: {
      const token = localStorage.getItem('token');
      const { newHardware, newHardwareCompany } = store.getState().hardware;
      axios.post('/hardware/add', {
        name: newHardware,
        company: newHardwareCompany,
      },
      {
        headers: { Authorization: `bearer ${token}` },
      })
        .then((res) => {
          console.log(res.data.message);
          store.dispatch(saveMessage(res.data.message));
        });
      break;
    }
    default:
      next(action);
  }
};

export default ajaxHardware;
