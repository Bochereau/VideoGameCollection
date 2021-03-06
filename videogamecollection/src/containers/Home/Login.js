import { connect } from 'react-redux';
import Login from '../../components/Login';
import { saveSlug } from '../../actions/home';
import { doLogin } from '../../actions/user';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  saveSlug: (slug) => {
    dispatch(saveSlug(slug));
  },
  doLogin: () => {
    dispatch(doLogin());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
