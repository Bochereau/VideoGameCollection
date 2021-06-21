import { connect } from 'react-redux';
import App from '../../components/App';
import { getHardware } from '../../actions/hardware';

const mapStateToProps = (state) => ({
  logged: state.user.logged,
  gameModalOpen: state.game.gameModalOpen,
  hardwareModalOpen: state.hardware.hardwareModalOpen,
  listName: state.global.listName,
});

const mapDispatchToProps = (dispatch) => ({
  getHardware: () => {
    dispatch(getHardware());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
