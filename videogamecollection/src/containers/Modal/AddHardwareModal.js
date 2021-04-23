import { connect } from 'react-redux';
import AddHardwareModal from '../../components/Modal/AddHardwareModal';
import { showHardwareModal } from '../../actions/game';
import { changeValue } from '../../actions/global';

const mapStateToProps = (state, ownProps) => ({
  hardwareModalOpen: state.game.hardwareModalOpen,
  currentValue: state[ownProps.name],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  showHardwareModal: () => {
    dispatch(showHardwareModal());
  },
  changeCurrentValue: (newValue) => {
    dispatch(changeValue(newValue, ownProps.name));
    console.log(ownProps.name);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddHardwareModal);
