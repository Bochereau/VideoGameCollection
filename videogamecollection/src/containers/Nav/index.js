import { connect } from 'react-redux';
import Nav from '../../components/Nav';
import { changeList } from '../../actions/global';

const mapStateToProps = (state) => ({
  listName: state.global.listName,
});

const mapDispatchToProps = (dispatch) => ({
  changeList: (listValue) => {
    dispatch(changeList(listValue));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
