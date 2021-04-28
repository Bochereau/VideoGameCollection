import { connect } from 'react-redux';
import AddGameModal from '../../components/Modal/AddGameModal';
import { showGameModal } from '../../actions/game';
import { changeValue } from '../../actions/global';

const mapStateToProps = (state, ownProps) => ({
  gameModalOpen: state.game.gameModalOpen,
  currentValue: state[ownProps.name],
  hardwareList: state.hardware.hardwareList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  showGameModal: () => {
    dispatch(showGameModal());
  },
  changeCurrentValue: (newValue) => {
    dispatch(changeValue(newValue, ownProps.name));
    console.log(ownProps.name);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGameModal);
