import React from "react";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import CardLink from 'react-bootstrap/CardLink';
import auth from '../utils/auth';
import { sendPost, sendDelete} from "../utils/requests";

function FragranceListingCard({
    fragranceListing,
    handleShowLoginModal,
    fragranceWatchlistedMapper,
    setFragranceWatchlistedMapper
}){
    const fragrance = fragranceListing.fragrance;
    const isWatchlisted = fragranceWatchlistedMapper[fragrance.id];

    // Add a fragrance to watchlist and update
    // its watchlisted state
    const addToWatchlist = async () => {

        // Don't allow watchlisting if the user isn't logged in
        const isLoggedIn = await auth.validateToken();
        if (!isLoggedIn) {
            handleShowLoginModal();
            return;
        }

        const response = await sendPost(`/api/watchlist/${fragrance.id}`);
        if (response.ok) {
            setFragranceWatchlistedMapper({
                ...fragranceWatchlistedMapper,
                [fragrance.id]: true
            });
        }
    }

    // Remove a fragrance from watchlist and update its watchlisted
    // state.
    const removeFromWatchlist = async () => {
        const response = await sendDelete(`/api/watchlist/${fragrance.id}`);
        if (response.ok) {
            setFragranceWatchlistedMapper({
                ...fragranceWatchlistedMapper,
                [fragrance.id]: false
            });
        }
    }

    return (
        <Card className={isWatchlisted ? 'border-info' : ''}>
            <Card.Img  style={{cursor: 'pointer'}} variant="top" src={fragrance.photoLink} onClick={() => window.open(fragranceListing.link, '_blank')} />
            <Card.Body>
            <Card.Title>{fragrance.title} ({fragranceListing.sizeoz} oz)</Card.Title>
            <div style={{marginLeft: '8px'}}>
                <Card.Subtitle>{fragrance.brand} ({fragrance.gender}) - {fragrance.concentration}</Card.Subtitle>
                <Card.Subtitle style={{marginTop: '4px'}}><strong>${fragranceListing.price}</strong></Card.Subtitle>
            </div>
            {isWatchlisted
            ? (
                <Button style={{marginTop: '12px'}} size="sm" variant="danger" onClick={removeFromWatchlist}>Remove from watchlist</Button>
            )
            : (
                <Button style={{marginTop: '12px'}} size="sm" variant="info" onClick={addToWatchlist}>Add to watchlist</Button>
            )
            }
            <div style={{marginTop: '12px'}}>
                <CardLink href={fragranceListing.link} target="_blank">See on {fragranceListing.site.replace('www.', '')}</CardLink>
            </div>
            </Card.Body>
        </Card>
    )
};

export default FragranceListingCard;