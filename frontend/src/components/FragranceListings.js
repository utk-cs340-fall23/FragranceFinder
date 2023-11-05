import React, {useRef, useState} from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FaFilter } from 'react-icons/fa';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';

function FragranceListings({
    xs,
    fragranceListings,
    showFilters,
    useOffcanvasFilters,
    setSearchInput,
    loadMoreListings,
    totalRows,
    sortBy,
    setSortBy,
    sortByOptions
}){
    const tempSearchInput = useRef('');
    const containerRef = useRef(null); // Ref for the scrollable container }

    const viewFragranceListing = (fragranceListing) => {
        window.open(fragranceListing.link, '_blank');
    }

    const handleSearchInputSubmit = (event) => {
        event.preventDefault();
        setSearchInput(tempSearchInput.current);
        containerRef.current.scrollTop = 0;
    }


    // Scroll event handler
    const onScroll = () => {
        const container = containerRef.current;

        // Check if the user has scrolled to the bottom
        if (Math.round(container.scrollHeight - container.scrollTop) <= container.clientHeight) {
            loadMoreListings();
        }
    }

    return (
        <Col xs={xs} style={{
            maxHeight: '100%',
        }}>
            <Form onSubmit={handleSearchInputSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                    placeholder="Search"
                    aria-label="Search"
                    onChange={(event) => tempSearchInput.current = event.target.value}
                    style={{
                        minWidth: '150px'
                    }}
                    />
                    <Button type="submit" variant="outline-primary">
                    Search
                    </Button>
                    <DropdownButton
                    variant="outline-secondary"
                    title={`Sort By: ${sortBy.name}`}
                    >
                        {Object.values(sortByOptions).map((sortByOption, i) => (
                            <Dropdown.Item  key={i} onClick={() => setSortBy(sortByOption)} active={sortByOption.name === sortBy.name}>
                                {sortByOption.name}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </InputGroup>
            </Form>
            <h4>Results ({totalRows}) {useOffcanvasFilters && (
                <Button variant="secondary" onClick={showFilters}><FaFilter /> Filters</Button>
            )}</h4>
            <div style={{maxHeight: '95%', overflowY: 'auto', paddingBottom: '100px'}} onScroll={onScroll} ref={containerRef}>
                <ResponsiveMasonry columnsCountBreakPoints={{0: 1, 400: 2, 1000: 3, 1500: 4}} style={{maxWidth: '95%'}}>
                    <Masonry columnsCount={3} gutter="10px">
                        {(fragranceListings.length
                            ? fragranceListings.map((f, i) => (
                                <Card key={i}>
                                    <Card.Img  style={{cursor: 'pointer'}} variant="top" src={f.fragrance.photoLink} onClick={() => window.open(f.link, '_blank')} />
                                    <Card.Body>
                                    <Card.Title>{f.fragrance.title} ({f.sizeoz} oz)</Card.Title>
                                    <div style={{marginLeft: '8px'}}>
                                        <Card.Subtitle>{f.fragrance.brand} ({f.fragrance.gender})</Card.Subtitle>
                                        <Card.Subtitle style={{marginTop: '4px'}}><strong>${f.price}</strong></Card.Subtitle>
                                    </div>
                                    <Button style={{marginTop: '12px'}} onClick={() => viewFragranceListing(f)} variant="primary" size="sm">See on {f.site}</Button>
                                    </Card.Body>
                                </Card>
                            ))
                            : (<p>No Results</p>)
                        )}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        </Col>
    )
};

export default FragranceListings;