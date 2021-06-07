import { Col, Container, Nav, Row } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import "../styles/Header.scss";

export interface HeaderProps {
  signin?: (name: string) => void;
  logout?: () => void;
  isLoggedIn?: boolean;
  username?: string;
}

function Header(props: HeaderProps) {
  const { isLoggedIn, signin, logout, username } = props;
  const history = useHistory();

  const userProfileButton = isLoggedIn ? (
    <Nav.Link
      onClick={() => {
        logout && logout();
        history.push("/");
      }}
    >
      Logout
    </Nav.Link>
  ) : (
    <Nav.Link
      onClick={() => {
        signin && signin("kek");
      }}
    >
      Sign in
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
    <Nav className="mb-2">
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
          {isLoggedIn ? <Col md="auto">{profileBadge}</Col> : null}
        </Row>
      </Container>
    </Nav>
  );
}

export default Header;
