import { connect } from 'react-redux';
import Company from '../../components/Panel/Company';
import { saveHardwareFilter, toggleCompany, getHardware } from '../../actions/hardware';

const mapStateToProps = (state) => ({
  hardwareList: state.hardware.hardwareList,
  filterHardware: state.hardware.filterHardware,
  videogamesList: state.game.videogamesList,
  selectedCompany: state.hardware.selectedCompany,
});

const mapDispatchToProps = (dispatch) => ({
  saveHardwareFilter: (filterHardware) => {
    dispatch(saveHardwareFilter(filterHardware));
  },
  toggleCompany: (company) => {
    dispatch(toggleCompany(company));
  },
  getHardware: () => {
    dispatch(getHardware());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Company);
