import { combineReducers } from 'redux';
import home from './home';
import user from './user';
import game from './game';

export default combineReducers({
  home,
  user,
  game,
});
