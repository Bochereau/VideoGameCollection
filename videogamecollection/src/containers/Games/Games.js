import { connect } from 'react-redux';
import Games from '../../components/Games';

const mapStateToProps = (state) => ({
  videogames: state.game.videogamesList,
  filterGame: state.game.filterGame,
  filterHardware: state.hardware.filterHardware,
});

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(Games);
