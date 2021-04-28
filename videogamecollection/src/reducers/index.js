import { combineReducers } from 'redux';
import home from './home';
import user from './user';
import game from './game';
import hardware from './hardware';
import global from './global';

export default combineReducers({
  home,
  user,
  game,
  hardware,
  global,
});
