import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import auth from '../utils/auth';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {FaCog} from 'react-icons/fa';

function Navigation() {
    const profile = auth.getProfile();
    const fullName = profile ? (
        `${profile.first_name} ${profile.last_name}`
    ) : '';

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Fragrance Finder</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        {auth.loggedIn()
        ? (
          <Nav className='me-auto'>
              <Navbar.Text>
               Signed in as: {fullName}
             </Navbar.Text>
             <NavDropdown title={<FaCog />}>
              <NavDropdown.Item href="#logout" onClick={auth.logout}>
              Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
            )
        : (
          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Signup</Nav.Link>
          </Nav>
        )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;