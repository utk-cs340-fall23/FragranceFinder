import React, {useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import auth from '../utils/auth';


function FilterBar({
    searchObject,
    setSearchObject,
    searchFragrances,
    defaultSearchObject,
    searchDefaults,
    xs,
    useSidebarFilter,
    hideFilters
}) {
    const updateSearchObject = (name, value) => {
        setSearchObject({
            ...searchObject,
            [name]: value
        });
    }

    const handleFormChange = (event) => {
        updateSearchObject(event.target.name, event.target.value);
    }

    // Range values are only 1-100. Normalize the value with its
    // associated max value. There is similiar logic in each of the
    // next two functions
    const handleRangeChange = (event, normalizer) => {
        const newVal = Math.round(
            (parseInt(event.target.value) / 100) * normalizer
        );
        updateSearchObject(event.target.name, newVal);
    }

    const getRangeValue = (val, normalizer) => {
        const newVal = Math.round((val / normalizer) * 100);
        return newVal;
    }

    // Set search object to defaults and search fragrances again
    const resetSearchObject = () => {
        setSearchObject(defaultSearchObject);
        searchFragrances(defaultSearchObject);
        if (hideFilters) {
            hideFilters();
        }
    }

    // Apply new filters to search.
    const handleApplyClick = () => {
        searchFragrances(searchObject);
        if (hideFilters) {
            hideFilters();
        }
    }

    // When brands are checked/unchecked, we need
    // to toggle their presence in the 'brands'
    // field of searchObject
    const handleBrandChange = (event) => {
        if (allBrandsChecked) {
            return;
        }

        const brandName = event.target.name;
        const brands = [...searchObject.brands];

        if (brands.includes(brandName) && !allBrandsChecked) {
            brands.splice(brands.indexOf(brandName), 1);
        }
        else if (!brands.includes(brandName)) {
            brands.push(brandName);
        }
        updateSearchObject('brands', brands);
    }

    const [allBrandsChecked, setAllBrandsChecked] = useState(!searchObject.brands.length);

    // If all brands are checked, empty brands in searchObject
    useEffect(() => {
        if (allBrandsChecked) {
            updateSearchObject('brands', []);
        }
    }, [allBrandsChecked]);


    const {maxSize, maxPrice} = searchDefaults;
    const genderOptions = ['All', 'Unisex', 'Male', 'Female'];

    return (
        <Col xs={xs} style={{
            borderRight: '1px solid lightgray',
            height: '100%',
        }}>
            {true && (
                <h4>
                    <span style={{
                        marginRight: '12px'
                    }}>
                        Filters
                    </span>
                    <span>
                        <Button size='sm' style={{marginRight: '12px'}} variant='danger' onClick={resetSearchObject}>Reset</Button>
                    </span>
                    <span>
                        <Button size='sm' onClick={handleApplyClick}>Apply</Button>
                    </span>
                </h4>
            )}
            <Form style={{
                maxHeight: '95%',
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>
                {auth.loggedIn() && (
                    <Form.Group style={{margin: '12px 0'}}>
                        <Form.Label><strong>Watchlist</strong></Form.Label>
                        <Form.Group>
                            <Form.Select name='watchlisted' onChange={handleFormChange} value={searchObject.watchlisteed}>
                                <option value=''>All</option>
                                <option value={true}>Watchlisted Only</option>
                                <option value={false}>Un-watchlisted Only</option>
                            </Form.Select>
                        </Form.Group>
                    </Form.Group>
                )}
                <Form.Group>
                    <Form.Label><strong>Price</strong></Form.Label>
                    <Form.Group style={{marginLeft: '8px'}}>
                        <Form.Label>Min:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="6">
                                <Form.Range
                                name='priceStart'
                                onChange={(event) => handleRangeChange(event, maxPrice)}
                                value={getRangeValue(searchObject.priceStart, maxPrice)}
                                />
                            </Col>
                            <Col xs="6">
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                    name='priceStart'
                                    value={searchObject.priceStart}
                                    onChange={handleFormChange}
                                    />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Label>Max:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="6">
                                <Form.Range
                                name='priceEnd'
                                onChange={(event) => handleRangeChange(event, maxPrice)}
                                value={getRangeValue(searchObject.priceEnd, maxPrice)}
                                />
                            </Col>
                            <Col xs="6">
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                    name='priceEnd'
                                    value={searchObject.priceEnd}
                                    onChange={handleFormChange}
                                    />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Size</strong></Form.Label>
                    <Form.Group style={{marginLeft: '8px'}}>
                    <Form.Label>Min:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="6">
                                <Form.Range
                                name='sizeStart'
                                onChange={(event) => handleRangeChange(event, maxSize)}
                                value={getRangeValue(searchObject.sizeStart, maxSize)}
                                />
                            </Col>
                            <Col xs="6">
                                <InputGroup className="mb-3">
                                    <Form.Control
                                    name='sizeStart'
                                    value={searchObject.sizeStart}
                                    onChange={handleFormChange}
                                    />
                                    <InputGroup.Text>oz</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Label>Max:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="6">
                                <Form.Range
                                name='sizeEnd'
                                onChange={(event) => handleRangeChange(event, maxSize)}
                                value={getRangeValue(searchObject.sizeEnd, maxSize)}
                                />
                            </Col>
                            <Col xs="6">
                                <InputGroup className="mb-3">
                                    <Form.Control
                                    name='sizeEnd'
                                    value={searchObject.sizeEnd}
                                    onChange={handleFormChange}
                                    />
                                    <InputGroup.Text>oz</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Gender</strong></Form.Label>
                    <Form.Group>
                        <Form.Select name='gender' onChange={handleFormChange} value={searchObject.gender}>
                            {genderOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Brand</strong></Form.Label>
                    <Form.Group style={{
                        maxHeight: '40vh',
                        overflowY: 'auto'
                    }}>
                        <Form.Check
                            type='checkbox'
                            name='all'
                            label={'All'}
                            checked={allBrandsChecked}
                            onChange={() => setAllBrandsChecked(!allBrandsChecked)}
                        />
                        {searchDefaults.brands.map((brand, i) => (
                            <Form.Check
                                key={i}
                                type='checkbox'
                                name={brand.brand}
                                label={`${brand.brand} (${brand.listingCount})`}
                                checked={searchObject.brands.includes(brand.brand) || allBrandsChecked}
                                onChange={handleBrandChange}
                            />
                        ))}
                    </Form.Group>
                </Form.Group>
            </Form>
        </Col>
    )
}

export default FilterBar;