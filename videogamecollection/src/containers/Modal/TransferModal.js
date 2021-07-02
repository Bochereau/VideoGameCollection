import { connect } from 'react-redux';
import TransferModal from '../../components/Modal/TransferModal';
import {
  addGame,
  newGameName,
  newGameHardware,
  newGameEditor,
  newGameDeveloper,
  newGameRelease,
} from '../../actions/game';
import { deleteWish, getWishlist, showTransferModal } from '../../actions/wishlist';

const mapStateToProps = (state) => ({
  transferModalOpen: state.wishlist.transferModalOpen,
  gameName: state.game.gameName,
});

const mapDispatchToProps = (dispatch) => ({
  showTransferModal: () => {
    dispatch(showTransferModal());
  },
  addGame: () => {
    dispatch(addGame());
  },
  deleteWish: () => {
    dispatch(deleteWish());
  },
  getWishlist: () => {
    dispatch(getWishlist());
  },
  newGameName: () => {
    dispatch(newGameName());
  },
  newGameHardware: () => {
    dispatch(newGameHardware());
  },
  newGameEditor: () => {
    dispatch(newGameEditor());
  },
  newGameDeveloper: () => {
    dispatch(newGameDeveloper());
  },
  newGameRelease: () => {
    dispatch(newGameRelease());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferModal);
