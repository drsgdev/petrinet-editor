import { Col, Container, Nav, Row } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import "../styles/Header.scss";

export interface HeaderProps {
  logout?: () => void;
  loggedIn?: boolean;
  username?: string;
}

function Header(props: HeaderProps) {
  const { loggedIn, logout, username } = props;
  const history = useHistory();

  const userProfileButton = loggedIn ? (
    <Nav.Link
      onClick={() => {
        logout?.();
        history.push("/");
      }}
    >
      Logout
    </Nav.Link>
  ) : (
    <Nav.Link
      onClick={() => {
        history.push("/login");
      }}
    >
      Login
    </Nav.Link>
  );

  const profileBadge = (
    <Nav.Item>
      <Nav.Link>
        <NavLink to="/profile">{username}</NavLink>
      </Nav.Link>
    </Nav.Item>
  );

  return (
    <Nav className="mb-3">
      <Container fluid>
        <Row className="justify-content-between">
          <Col>
            <Nav.Item>
              <Nav.Link>
                <NavLink to="/" exact>
                  Home
                </NavLink>
              </Nav.Link>
            </Nav.Item>
          </Col>
          <Col xs={1} md="auto">
            <Nav.Item>{userProfileButton}</Nav.Item>
          </Col>
          {loggedIn ? <Col md="auto">{profileBadge}</Col> : null}
        </Row>
      </Container>
    </Nav>
  );
}

export default Header;
