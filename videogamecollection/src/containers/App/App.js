import { connect } from 'react-redux';
import App from '../../components/App';

const mapStateToProps = (state) => ({
  logged: state.user.logged,
});

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
