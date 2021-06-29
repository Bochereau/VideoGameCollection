import { connect } from 'react-redux';
import Subscribe from '../../components/Subscribe';
import { saveSlug } from '../../actions/home';
import {
  changeEmailValue,
  changePseudoValue,
  changePasswordValue,
  changeVerifiedPasswordValue,
  addUser,
} from '../../actions/user';

const mapStateToProps = (state) => ({
  emailValue: state.user.email,
  pseudoValue: state.user.pseudo,
  passwordValue: state.user.password,
  verifiedPasswordValue: state.user.verifiedPassword,
});

const mapDispatchToProps = (dispatch) => ({
  saveSlug: (slug) => {
    dispatch(saveSlug(slug));
  },
  changeEmailValue: (emailValue) => {
    dispatch(changeEmailValue(emailValue));
  },
  changePseudoValue: (pseudoValue) => {
    dispatch(changePseudoValue(pseudoValue));
  },
  changePasswordValue: (passwordValue) => {
    dispatch(changePasswordValue(passwordValue));
  },
  changeVerifiedPasswordValue: (verifiedPasswordValue) => {
    dispatch(changeVerifiedPasswordValue(verifiedPasswordValue));
  },
  addUser: () => {
    dispatch(addUser());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Subscribe);
