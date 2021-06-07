import { connect } from "react-redux";
import Header from "./modules/Header";
import { actionCreators } from "./slices/Header";

const mapStateToProps = (state: any) => {
  const { header } = state;

  return header;
};

export default connect(mapStateToProps, actionCreators)(Header);
