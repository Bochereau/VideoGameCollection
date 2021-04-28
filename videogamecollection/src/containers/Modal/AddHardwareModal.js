import { connect } from 'react-redux';
import AddHardwareModal from '../../components/Modal/AddHardwareModal';
import { showHardwareModal, changeHardwareValue, newHardwareConstructor } from '../../actions/hardware';

const mapStateToProps = (state) => ({
  hardwareModalOpen: state.hardware.hardwareModalOpen,
  currentHardwareValue: state.hardware.newHardware,
});

const mapDispatchToProps = (dispatch) => ({
  showHardwareModal: () => {
    dispatch(showHardwareModal());
  },
  changeHardwareValue: (newValue) => {
    dispatch(changeHardwareValue(newValue));
  },
  newHardwareConstructor: (constructor) => {
    dispatch(newHardwareConstructor(constructor));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddHardwareModal);
