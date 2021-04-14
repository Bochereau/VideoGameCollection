import { connect } from 'react-redux';
import Subscribe from '../../components/Subscribe';
import { saveSlug } from '../../actions/home';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  saveSlug: (slug) => {
    dispatch(saveSlug(slug));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Subscribe);
