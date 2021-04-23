import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logout } from '../../actions/user';
import { showGameModal, saveGameFilter } from '../../actions/game';

const mapStateToProps = (state) => ({
  filterGame: state.game.filterGame,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
