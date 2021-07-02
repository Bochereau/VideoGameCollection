import { connect } from 'react-redux';
import Games from '../../components/Games';
import { getGame } from '../../actions/game';

const mapStateToProps = (state) => ({
  videogames: state.game.videogamesList,
  filterGame: state.game.filterGame,
  filterHardware: state.hardware.filterHardware,
  search: state.game.search,
});

const mapDispatchToProps = (dispatch) => ({
  getGame: () => {
    dispatch(getGame());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Games);
