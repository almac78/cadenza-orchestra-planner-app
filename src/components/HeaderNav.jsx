/* Fixed header with the main navigation menu. Stays visible at the top of every page. */
import { useState } from "react";
// Bootstrap components for building the navigation bar UI.
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// React Router components for navigation and linking.
import { Link, NavLink, useNavigate } from "react-router-dom";
// Authentication hook to read and change login state.
import { useAuth } from "../hooks/useAuth";
// Branded logo asset
import cadenzaLogo from "../assets/cadenza-lockup-serifC.svg";

export default function HeaderNav() {
  // Get authentication state and navigation function.
  const { isLoggedIn, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  // Manages the expanded/collapsed state of the menu on smaller screens.
  const [expanded, setExpanded] = useState(false);

  // Closes the menu on smaller screens after a link is clicked.
  function closeMenu() {
    setExpanded(false);
  }

  // Logs the user out and redirects to the login page.
  function handleLogout() {
    logout();
    closeMenu();
    navigate("/login");
  }

  return (
    <Navbar
      expand="md"
      fixed="top"
      className="cz-navbar"
      expanded={expanded}
      onToggle={(next) => setExpanded(next)}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={isLoggedIn ? "/dashboard" : "/login"}
          onClick={closeMenu}
          className="d-flex align-items-center py-0"
        >
          <img
            src={cadenzaLogo}
            alt="Cadenza Orchestra Planner"
            className="cz-logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/dashboard" onClick={closeMenu}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/add" onClick={closeMenu}>
              Add Call
            </Nav.Link>
            <Nav.Link as={NavLink} to="/help" onClick={closeMenu}>
              Help
            </Nav.Link>
          </Nav>

          <Nav>
            {isLoggedIn ? (
              <NavDropdown
                title={
                  <span>
                    <span className="cz-avatar" aria-hidden="true">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </span>
                    {currentUser?.name}
                  </span>
                }
                id="account-dropdown"
                align="end"
              >
                <NavDropdown.Item as={NavLink} to="/account" onClick={closeMenu}>
                  My Account
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" onClick={closeMenu}>
                  Log in
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" onClick={closeMenu}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}