import { connect } from 'react-redux';
import Card from '../../components/Card';
import {
  toggleGame,
  getGameId,
  showDeleteModal,
  getGame,
  finishedGame,
  updateGame,
} from '../../actions/game';

const mapStateToProps = (state) => ({
  selectedGame: state.game.selectedGame,
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
  getGame: () => {
    dispatch(getGame());
  },
  updateGame: () => {
    dispatch(updateGame());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
