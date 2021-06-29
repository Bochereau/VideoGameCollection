import { connect } from 'react-redux';
import Login from '../../components/Login';
import { saveSlug } from '../../actions/home';
import { signin, changePseudoValue, changePasswordValue } from '../../actions/user';

const mapStateToProps = (state) => ({
  pseudoValue: state.user.pseudo,
  passwordValue: state.user.password,
});

const mapDispatchToProps = (dispatch) => ({
  saveSlug: (slug) => {
    dispatch(saveSlug(slug));
  },
  signin: () => {
    dispatch(signin());
  },
  changePseudoValue: (pseudoValue) => {
    dispatch(changePseudoValue(pseudoValue));
  },
  changePasswordValue: (passwordValue) => {
    dispatch(changePasswordValue(passwordValue));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
