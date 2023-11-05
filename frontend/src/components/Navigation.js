import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import auth from '../utils/auth';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {FaCog} from 'react-icons/fa';
import '../assets/css/navbar.css';

function Navigation({style}) {
    const profile = auth.getProfile();
    const fullName = profile ? (
        `${profile.firstName} ${profile.lastName}`
    ) : '';

  return (
    <Navbar className="navigation bg-body-tertiary" style={style}>
      <Container>
        <Navbar.Brand href="/"><h2>Fragrance Finder</h2></Navbar.Brand>
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