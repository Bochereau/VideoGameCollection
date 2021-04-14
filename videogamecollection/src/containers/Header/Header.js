import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logout } from '../../actions/user';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch(logout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
