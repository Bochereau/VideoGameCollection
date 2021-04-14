import { SAVE_SLUG } from '../actions/home';

const initialState = {
  slug: 'login',
};

const home = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_SLUG:
      return {
        ...state,
        slug: action.slug,
      };
    default:
      return state;
  }
};

export default home;
