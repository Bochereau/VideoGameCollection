import { connect } from 'react-redux';
import Card from '../../components/Card';
import { toggleGame } from '../../actions/game';

const mapStateToProps = (state) => ({
  selectedGame: state.game.selectedGame,
});

const mapDispatchToProps = (dispatch) => ({
  toggleGame: (game) => {
    dispatch(toggleGame(game));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
