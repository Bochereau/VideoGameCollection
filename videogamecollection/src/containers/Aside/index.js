import { connect } from 'react-redux';
import Aside from '../../components/Aside';
import { openAside } from '../../actions/global';

const mapStateToProps = (state) => ({
  toggleAside: state.global.toggleAside,
});

const mapDispatchToProps = (dispatch) => ({
  openAside: () => {
    dispatch(openAside());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Aside);
