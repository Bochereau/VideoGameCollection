import { connect } from 'react-redux';
import Home from '../../components/Home';

const mapStateToProps = (state) => ({
  slug: state.home.slug,
});

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
