import { connect } from 'react-redux';
import Notification from '../../components/App/Notification';
import { saveMessage } from '../../actions/global';

const mapStateToProps = (state) => ({
  message: state.global.newMessage,
});

const mapDispatchToProps = (dispatch) => ({
  saveMessage: () => {
    dispatch(saveMessage());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
