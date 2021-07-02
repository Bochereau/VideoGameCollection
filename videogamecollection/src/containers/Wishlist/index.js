import { connect } from 'react-redux';
import Wishlist from '../../components/Wishlist';
import { getGameId, showDeleteModal } from '../../actions/game';

const mapStateToProps = (state) => ({
  wishlist: state.wishlist.list,
});

const mapDispatchToProps = (dispatch) => ({
  getGameId: (gameId) => {
    dispatch(getGameId(gameId));
  },
  showDeleteModal: () => {
    dispatch(showDeleteModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
