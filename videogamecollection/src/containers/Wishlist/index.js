import { connect } from 'react-redux';
import Wishlist from '../../components/Wishlist';
import {
  getGameId,
  showDeleteModal,
  newGameName,
  newGameHardware,
  newGameEditor,
  newGameDeveloper,
  newGameRelease,
} from '../../actions/game';

import { showTransferModal } from '../../actions/wishlist';

const mapStateToProps = (state) => ({
  wishlist: state.wishlist.list,
  gameId: state.game.gameId,
});

const mapDispatchToProps = (dispatch) => ({
  getGameId: (gameId) => {
    dispatch(getGameId(gameId));
  },
  showDeleteModal: () => {
    dispatch(showDeleteModal());
  },
  showTransferModal: () => {
    dispatch(showTransferModal());
  },
  newGameName: (name) => {
    dispatch(newGameName(name));
  },
  newGameHardware: (hardware) => {
    dispatch(newGameHardware(hardware));
  },
  newGameEditor: (editorValue) => {
    dispatch(newGameEditor(editorValue));
  },
  newGameDeveloper: (developerValue) => {
    dispatch(newGameDeveloper(developerValue));
  },
  newGameRelease: (releaseValue) => {
    dispatch(newGameRelease(releaseValue));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
