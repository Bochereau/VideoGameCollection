import { createStore, compose, applyMiddleware } from 'redux';

import rootReducer from '../reducers';
import ajaxHardware from '../middleware/ajaxHardware';
import ajaxGame from '../middleware/ajaxGame';
import ajaxUser from '../middleware/ajaxUser';
import ajaxWishlist from '../middleware/ajaxWishlist';
import giantBomb from '../middleware/giantBomb';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = composeEnhancers(
  applyMiddleware(
    ajaxHardware,
    ajaxGame,
    ajaxUser,
    ajaxWishlist,
    giantBomb,
  ),
);

const store = createStore(
  rootReducer,
  enhancers,
);

export default store;
