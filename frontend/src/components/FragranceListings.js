import React from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Placeholder from 'react-bootstrap/Placeholder';
import 'holderjs';

const FragranceListings = ({xs, count}) => {
    const range = [...Array(count).keys()];

    return (
        <Col xs={xs} style={{
            maxHeight: '100%',
            overflowY: 'auto',
        }}>
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}} style={{maxWidth: '95%'}}>
            <Masonry columnsCount={3} gutter="10px">
                {range.map((i) => (
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
                ))}
            </Masonry>
            </ResponsiveMasonry>
        </Col>
    )
};

export default FragranceListings;