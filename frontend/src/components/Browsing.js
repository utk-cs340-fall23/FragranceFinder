import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterBar from './FilterBar';
import FragranceListings from './FragranceListings';

const Browsing = () => {
    const [searchObject, setSearchObject] = useState({});

    return (
        <Container style={{
            height: '95vh',
            width: '100%',
        }}>
          <Row style={{
            height: '100%'
          }}>
            <FilterBar
            xs={2}
            searchObject={searchObject}
            setSearchObject={setSearchObject}
            />
            <FragranceListings xs={10} count={100}/>
          </Row>
        </Container>
    );
};

export default Browsing;