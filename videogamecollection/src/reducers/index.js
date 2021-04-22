import { combineReducers } from 'redux';
import home from './home';
import user from './user';
import game from './game';
import global from './global';

export default combineReducers({
  home,
  user,
  game,
  global,
});
