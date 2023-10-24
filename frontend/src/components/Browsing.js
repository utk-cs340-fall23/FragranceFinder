import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterBar from './FilterBar';
import FragranceListings from './FragranceListings';
import { sendGet } from '../utils/requests';

const Browsing = ({style}) => {
    const [searchObject, setSearchObject] = useState({});
    const [fragranceListings, setFragranceListings] = useState(null);

    const getFragrances = async () => {
      const response = await sendGet('/api/fragrance-listings');
      if (response.ok && response.data.success) {
        setFragranceListings(response.data.data);
      }
    }

    useEffect(() => getFragrances, [searchObject]);

    return (
        <Container style={style}>
          <Row style={{
            height: '100%'
          }}>
            <FilterBar
            xs={2}
            searchObject={searchObject}
            setSearchObject={setSearchObject}
            />
            <FragranceListings xs={10} fragranceListings={fragranceListings}/>
          </Row>
        </Container>
    );
};

export default Browsing;