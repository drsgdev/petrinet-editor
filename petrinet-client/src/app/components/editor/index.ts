import { connect } from "react-redux";
import Editor from "./modules/Editor";

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(Editor);
