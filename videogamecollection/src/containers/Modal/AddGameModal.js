import { connect } from 'react-redux';
import AddGameModal from '../../components/Modal/AddGameModal';

import {
  showGameModal,
  newGameName,
  newGameHardware,
  newGameEditor,
  newGameDeveloper,
  newGameRelease,
  addGame,
  getGame,
  doSearch,
} from '../../actions/game';

import { getWishlist, addWish } from '../../actions/wishlist';

const mapStateToProps = (state) => ({
  gameModalOpen: state.game.gameModalOpen,
  hardwareList: state.hardware.hardwareList,
  currentNameValue: state.game.gameName,
  currentEditorValue: state.game.gameEditor,
  currentDeveloperValue: state.game.gameDeveloper,
  currentReleaseValue: state.game.gameRelease,
  listName: state.global.listName,
});

const mapDispatchToProps = (dispatch) => ({
  showGameModal: () => {
    dispatch(showGameModal());
  },
  newGameName: (nameValue) => {
    dispatch(newGameName(nameValue));
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
  addGame: () => {
    dispatch(addGame());
  },
  getGame: () => {
    dispatch(getGame());
  },
  getWishlist: () => {
    dispatch(getWishlist());
  },
  addWish: () => {
    dispatch(addWish());
  },
  doSearch: () => {
    dispatch(doSearch());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGameModal);
