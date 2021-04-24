import { connect } from 'react-redux';
import Panel from '../../components/Panel';
import { saveHardwareFilter, showHardwareModal } from '../../actions/game';

const mapStateToProps = (state) => ({
  hardwareList: state.game.hardwareList,
  filterHardware: state.game.filterHardware,
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
