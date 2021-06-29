import { createStore, compose, applyMiddleware } from 'redux';

import rootReducer from '../reducers';
import logMiddleware from '../middleware/logMiddleware';
import ajaxHardware from '../middleware/ajaxHardware';
import ajaxGame from '../middleware/ajaxGame';
import ajaxUser from '../middleware/ajaxUser';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = composeEnhancers(
  applyMiddleware(
    logMiddleware,
    ajaxHardware,
    ajaxGame,
    ajaxUser,
  ),
);

const store = createStore(
  rootReducer,
  enhancers,
);

export default store;
