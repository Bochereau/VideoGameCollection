import { connect } from 'react-redux';
import Panel from '../../components/Panel';
import { saveHardwareFilter } from '../../actions/game';

const mapStateToProps = (state) => ({
  hardwareList: state.game.hardwareList,
});

const mapDispatchToProps = (dispatch) => ({
  saveHardwareFilter: (filterHardware) => {
    dispatch(saveHardwareFilter(filterHardware));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
