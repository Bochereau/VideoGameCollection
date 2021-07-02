import { connect } from 'react-redux';
import DeleteModal from '../../components/Modal/DeleteModal';
import { deleteGame, showDeleteModal, getGame } from '../../actions/game';
import { deleteWish, getWishlist } from '../../actions/wishlist';

const mapStateToProps = (state) => ({
  deleteModalOpen: state.game.deleteModalOpen,
  listName: state.global.listName,
  videogamesList: state.game.videogamesList,
  wishList: state.wishlist.list,
  gameId: state.game.gameId,
});

const mapDispatchToProps = (dispatch) => ({
  showDeleteModal: () => {
    dispatch(showDeleteModal());
  },
  deleteGame: () => {
    dispatch(deleteGame());
  },
  getGame: () => {
    dispatch(getGame());
  },
  deleteWish: () => {
    dispatch(deleteWish());
  },
  getWishlist: () => {
    dispatch(getWishlist());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
