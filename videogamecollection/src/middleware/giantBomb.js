import axios from 'axios';

import { DO_SEARCH } from '../actions/game';

const giantBomb = (store) => (next) => (action) => {
  switch (action.type) {
    case DO_SEARCH: {
      const {
        gameName,
      } = store.getState().game;
      axios.get(`https://www.giantbomb.com/api/search/?api_key=dc0135d075de95a60c2690cf578cc647d809e702&format=json&query=${gameName}&resources=game`)
        .then((res) => {
          console.log(res);
        });
      break;
    }
    default:
      next(action);
  }
};

export default giantBomb;
