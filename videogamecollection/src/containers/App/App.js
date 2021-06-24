import { connect } from 'react-redux';
import App from '../../components/App';
import { getHardware } from '../../actions/hardware';
import { getGame } from '../../actions/game';

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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
