import { connect } from 'react-redux';
import App from '../../components/App';

const mapStateToProps = (state) => ({
  logged: state.user.logged,
  gameModalOpen: state.game.gameModalOpen,
  hardwareModalOpen: state.hardware.hardwareModalOpen,
});

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
