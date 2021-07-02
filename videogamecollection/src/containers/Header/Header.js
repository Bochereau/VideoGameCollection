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
  saveSearch,
} from '../../actions/game';

const mapStateToProps = (state) => ({
  filterGame: state.game.filterGame,
  listName: state.global.listName,
  pseudo: state.user.pseudo,
  search: state.game.search,
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
  saveSearch: (search) => {
    dispatch(saveSearch(search));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
