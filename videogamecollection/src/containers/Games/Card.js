import { connect } from 'react-redux';
import Card from '../../components/Card';
import { getGameId, showDetails } from '../../actions/game';

const mapStateToProps = (state) => ({
  gameId: state.game.gameId,
  showed: state.game.showed,
});

const mapDispatchToProps = (dispatch) => ({
  getGameId: (gameId) => {
    dispatch(getGameId(gameId));
  },
  showDetails: () => {
    dispatch(showDetails());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
