import { connect } from 'react-redux';
import Login from '../../components/Login';
import { saveSlug } from '../../actions/home';
import { doLogin } from '../../actions/user';
import { getHardware } from '../../actions/hardware';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  saveSlug: (slug) => {
    dispatch(saveSlug(slug));
  },
  doLogin: () => {
    dispatch(doLogin());
  },
  getHardware: () => {
    dispatch(getHardware());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
