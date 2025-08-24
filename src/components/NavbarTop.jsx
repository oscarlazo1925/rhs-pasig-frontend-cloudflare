import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Spinner } from "react-bootstrap";
import { useState } from "react";

function AppNavbar({ user, handleGoogleLogin, handleLogout, loginText }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      // bg="secondary"
      variant="secondary"
      expand="lg"
      expanded={expanded}
      className="navbar-float rizal-color"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          RHS-PASIG
        </Navbar.Brand>

        {/* Toggle */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Link
                  to="/"
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Home
                </Link>
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Profile
                </Link>

                <Link
                  to="/scan"
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Scan
                </Link>



                <Link
                  to="#"
                  className="nav-link"
                  onClick={() => {
                    handleLogout();
                    setExpanded(false);
                  }}
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                to="#"
                className={`nav-link ${loginText ? "disabled-link" : ""}`}
                onClick={(e) => {
                  if (loginText) {
                    e.preventDefault();
                    return;
                  }
                  handleGoogleLogin();
                  setExpanded(false);
                }}
                style={{
                  pointerEvents: loginText ? "none" : "auto",
                  opacity: loginText ? 0.6 : 1,
                }}
              >
                {loginText ? (
                  <>
                    <Spinner
                      animation="grow"
                      style={{ width: "0.75rem", height: "0.75rem" }}
                      className="me-1"
                    />
                    <Spinner
                      animation="grow"
                      style={{ width: "0.75rem", height: "0.75rem" }}
                      className="me-1"
                    />
                    <Spinner
                      animation="grow"
                      style={{ width: "0.75rem", height: "0.75rem" }}
                    />
                  </>
                ) : (
                  "Login"
                )}
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
