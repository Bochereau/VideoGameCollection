import { connect } from 'react-redux';
import DeleteModal from '../../components/Modal/DeleteModal';
import { deleteGame, showDeleteModal, getGame } from '../../actions/game';

const mapStateToProps = (state) => ({
  deleteModalOpen: state.game.deleteModalOpen,
  videogamesList: state.game.videogamesList,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
