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
} from '../../actions/game';

const mapStateToProps = (state) => ({
  gameModalOpen: state.game.gameModalOpen,
  hardwareList: state.hardware.hardwareList,
  currentNameValue: state.game.gameName,
  currentEditorValue: state.game.gameEditor,
  currentDeveloperValue: state.game.gameDeveloper,
  currentReleaseValue: state.game.gameRelease,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGameModal);
