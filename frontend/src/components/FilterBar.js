import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function FilterBar({searchObject, setSearchObject, xs}) {

    return (
        <Col xs={xs}>
            <h3>Filters</h3>
        </Col>
    )
}

export default FilterBar;