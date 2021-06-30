import { connect } from 'react-redux';
import Card from '../../components/Card';
import {
  toggleGame,
  getGameId,
  showDeleteModal,
  getGame,
  finishedGame,
  boxGame,
  manualGame,
  physicalGame,
  dematGame,
  newGameDescription,
  updateGame,
} from '../../actions/game';

const mapStateToProps = (state) => ({
  selectedGame: state.game.selectedGame,
  newDescription: state.game.newDescription,
});

const mapDispatchToProps = (dispatch) => ({
  toggleGame: (game) => {
    dispatch(toggleGame(game));
  },
  getGameId: (gameId) => {
    dispatch(getGameId(gameId));
  },
  showDeleteModal: () => {
    dispatch(showDeleteModal());
  },
  finishedGame: (finished) => {
    dispatch(finishedGame(finished));
  },
  boxGame: (box) => {
    dispatch(boxGame(box));
  },
  manualGame: (manual) => {
    dispatch(manualGame(manual));
  },
  physicalGame: (physical) => {
    dispatch(physicalGame(physical));
  },
  dematGame: (demat) => {
    dispatch(dematGame(demat));
  },
  newGameDescription: (description) => {
    dispatch(newGameDescription(description));
  },
  getGame: () => {
    dispatch(getGame());
  },
  updateGame: () => {
    dispatch(updateGame());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
