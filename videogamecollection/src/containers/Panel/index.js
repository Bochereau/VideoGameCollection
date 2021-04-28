import { connect } from 'react-redux';
import Panel from '../../components/Panel';
import { saveHardwareFilter, showHardwareModal } from '../../actions/hardware';

const mapStateToProps = (state) => ({
  hardwareList: state.hardware.hardwareList,
  filterHardware: state.hardware.filterHardware,
  videogamesList: state.game.videogamesList,
});

const mapDispatchToProps = (dispatch) => ({
  saveHardwareFilter: (filterHardware) => {
    dispatch(saveHardwareFilter(filterHardware));
  },
  showHardwareModal: () => {
    dispatch(showHardwareModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
