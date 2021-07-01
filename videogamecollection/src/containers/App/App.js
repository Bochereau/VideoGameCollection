import { connect } from 'react-redux';
import App from '../../components/App';
import { getHardware } from '../../actions/hardware';
import { getGame } from '../../actions/game';
import { getWishlist } from '../../actions/wishlist';

const mapStateToProps = (state) => ({
  logged: state.user.logged,
  gameModalOpen: state.game.gameModalOpen,
  hardwareModalOpen: state.hardware.hardwareModalOpen,
  deleteModalOpen: state.game.deleteModalOpen,
  listName: state.global.listName,
});

const mapDispatchToProps = (dispatch) => ({
  getHardware: () => {
    dispatch(getHardware());
  },
  getGame: () => {
    dispatch(getGame());
  },
  getWishlist: () => {
    dispatch(getWishlist());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
