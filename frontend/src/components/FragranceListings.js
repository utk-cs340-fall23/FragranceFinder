import React from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Placeholder from 'react-bootstrap/Placeholder';
import Button from "react-bootstrap/Button";
import 'holderjs';

const FragranceListings = ({xs, fragranceListings}) => {
    const range = [...Array(50).keys()];

    const viewFragranceListing = (fragranceListing) => {
        window.open(fragranceListing.link, '_blank');
    }

    const placeholders = range.map(i => (
        <Card key={i} style={{}}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                <Placeholder xs={6} /> <Placeholder xs={8} />
            </Placeholder>
            <Placeholder.Button variant="primary" xs={6} />
            </Card.Body>
        </Card>
    ))
    return (
        <Col xs={xs} style={{
            maxHeight: '100%',
            overflowY: 'auto',
        }}>
            <h3>Results</h3>
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}} style={{maxWidth: '95%'}}>
            <Masonry columnsCount={3} gutter="10px">
                {fragranceListings == null ? placeholders :
                (fragranceListings.length
                    ? fragranceListings.map((f, i) => (
                        <Card key={i}>
                            <Card.Img  style={{cursor: 'pointer'}} variant="top" src={f.fragrance.photoLink} onClick={() => window.open(f.link, '_blank')} />
                            <Card.Body>
                              <Card.Title>{f.fragrance.title} ({f.sizeoz} oz)</Card.Title>
                              <Card.Subtitle>${f.price}</Card.Subtitle>
                              <Button style={{marginTop: '12px'}} onClick={() => viewFragranceListing(f)} variant="primary" size="sm">See on {f.site}</Button>
                            </Card.Body>
                          </Card>
                    ))
                    : (<p>No Results</p>)
                )}
            </Masonry>
            </ResponsiveMasonry>
        </Col>
    )
};

export default FragranceListings;