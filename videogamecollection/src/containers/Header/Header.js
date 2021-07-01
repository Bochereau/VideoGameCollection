import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logout } from '../../actions/user';
import {
  showGameModal,
  saveGameFilter,
  boxGame,
  manualGame,
  physicalGame,
  dematGame,
  newGameDescription,
} from '../../actions/game';

const mapStateToProps = (state) => ({
  filterGame: state.game.filterGame,
  listName: state.global.listName,
  pseudo: state.user.pseudo,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch(logout());
  },
  showGameModal: () => {
    dispatch(showGameModal());
  },
  saveGameFilter: (filterGame) => {
    dispatch(saveGameFilter(filterGame));
  },
  boxGame: (box) => {
    dispatch(boxGame(box));
  },
  manualGame: (manual) => {
    dispatch(manualGame(manual));
  },
  physicalGame: (physical) => {
    dispatch(physicalGame(physical));
  },
  dematGame: (demat) => {
    dispatch(dematGame(demat));
  },
  newGameDescription: (description) => {
    dispatch(newGameDescription(description));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
