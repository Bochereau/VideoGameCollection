import { connect } from 'react-redux';
import Wishlist from '../../components/Wishlist';

const mapStateToProps = (state) => ({
  wishlist: state.game.wishlist,
});

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
