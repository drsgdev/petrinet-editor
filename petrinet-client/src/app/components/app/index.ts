import { connect } from "react-redux";
import App from "./modules/App";

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(App);
