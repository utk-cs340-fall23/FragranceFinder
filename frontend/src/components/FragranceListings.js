import React, {useEffect, useRef, useState} from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FaFilter } from 'react-icons/fa';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';
import FragranceListingCard from "./FragranceListingCard";
import Modal from "react-bootstrap/Modal";

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
    const containerRef = useRef(null);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [fragranceWatchlistedMapper, setFragranceWatchlistedMapper] = useState({});

    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleShowLoginModal = () => setShowLoginModal(true);

    const handleSearchInputSubmit = (event) => {
        event.preventDefault();
        setSearchInput(tempSearchInput.current);
        containerRef.current.scrollTop = 0;
    }

    useEffect(() => {
        const mapping = Object.fromEntries(
            fragranceListings.map(l => [l.fragrance.id, l.fragrance.watchlisted])
        );
        setFragranceWatchlistedMapper(mapping);
    }, [fragranceListings])

    // Scroll event handler
    const onScroll = () => {
        const container = containerRef.current;

        // Check if the user has scrolled to the bottom
        if (Math.round(container.scrollHeight - container.scrollTop) <= container.clientHeight) {
            loadMoreListings();
        }
    }
    return (
        <>
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
                    <ResponsiveMasonry columnsCountBreakPoints={{0: 1, 400: 2, 1000: 3}} style={{maxWidth: '95%'}}>
                        <Masonry columnsCount={3} gutter="10px">
                            {(fragranceListings.length
                                ? fragranceListings.map((f, i) => (
                                    <FragranceListingCard
                                    key={i}
                                    fragranceListing={f}
                                    handleShowLoginModal={handleShowLoginModal}
                                    fragranceWatchlistedMapper={fragranceWatchlistedMapper}
                                    setFragranceWatchlistedMapper={setFragranceWatchlistedMapper}
                                    />
                                ))
                                : (<p>No Results</p>)
                            )}
                        </Masonry>
                    </ResponsiveMasonry>
                </div>
            </Col>
            <>
                <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Not Logged In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You must be logged in to add items to your watchlist.</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLoginModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => window.location.replace('/login')}>
                        Log In
                    </Button>
                    <Button variant="primary" onClick={() => window.location.replace('/signup')}>
                        Sign Up
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    )
};

export default FragranceListings;