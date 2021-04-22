import { connect } from 'react-redux';
import Modale from '../../components/Modale';
import { showModal } from '../../actions/game';
import { changeValue } from '../../actions/global';

const mapStateToProps = (state, ownProps) => ({
  modalOpen: state.game.modalOpen,
  currentValue: state[ownProps.name],
  hardwareList: state.game.hardwareList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  showModal: () => {
    dispatch(showModal());
  },
  changeCurrentValue: (newValue) => {
    dispatch(changeValue(newValue, ownProps.name));
    console.log(ownProps.name);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Modale);
