import React, {useEffect, useState, useRef, useCallback} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FilterBar from './FilterBar';
import FragranceListings from './FragranceListings';
import { sendGet } from '../utils/requests';
import Offcanvas from 'react-bootstrap/Offcanvas';

const SMALL_SCREEN_CUTOFF = 800;

const Browsing = ({style}) => {
    // Handle screen size changes with the next few variables/functions
    const [useOffcanvasFilters, setUseOffcanvasFilters] = useState(
      window.innerWidth < SMALL_SCREEN_CUTOFF
    );

    const [searchInput, setSearchInput] = useState('');
    const isFirstRender = useRef(true);
    const totalRows = useRef(0);
    const paginationPage = useRef(0);

    const updateScreenState = () => {
        setUseOffcanvasFilters(
            window.innerWidth < SMALL_SCREEN_CUTOFF
        );
    };

    useEffect(() => {
        window.addEventListener('resize', updateScreenState);

        return () => {
            window.removeEventListener('resize', updateScreenState);
        }
    }, []);

    // Initialize variables related to searching
    const [searchDefaults, setSearchDefaults] = useState({
      maxPrice: 1000,
      maxSize: 100,
      brands: []
    });

    const [defaultSearchObject, setDefaultSearchObject] = useState({
      price_start: 0,
      price_end: searchDefaults.maxPrice,
      size_start: 0,
      size_end: searchDefaults.maxSize,
      brands: searchDefaults.brands,
      gender: 'All'
    });

    const [searchObject, setSearchObject] = useState(defaultSearchObject);
    const [fragranceListings, setFragranceListings] = useState([]);
    const fragranceListingsRef = useRef(fragranceListings);

    // Use searchObject to search for fragrances
    const searchFragrances = useCallback(async (params, page) => {
      const {append, ...searchParams} = params;
      const url = '/api/fragrance-listings';
      const response = await sendGet(
          `${url}?${new URLSearchParams({
            ...searchParams,
            page: page || 0
          }).toString()}`
      );
      if (response.ok && response.data.success) {
          totalRows.current = response.data.totalCount;

          if (append) {
            fragranceListingsRef.current = fragranceListingsRef.current.concat(
              response.data.data
            );
            setFragranceListings(fragranceListingsRef.current);
          }
          else {
            paginationPage.current = 0;
            fragranceListingsRef.current = response.data.data;
            setFragranceListings(fragranceListingsRef.current);
          }
      }
  }, []);

    const loadMoreListings = () => {
      if (fragranceListings.length < totalRows.current) {
        paginationPage.current += 1;
        searchFragrances({
          ...searchObject,
          searchInput: searchInput,
          append: true
        }, paginationPage.current);
      }
    }

    const getSearchDefaults = async () => {
      const response = await sendGet('/api/fragrance-listings/search-defaults');
      const searchDefaultsData = response.data.data;
      const newMaxPrice = Math.round(searchDefaultsData.maxPrice);
      const newMaxSize = Math.round(searchDefaultsData.maxSize);

      setSearchDefaults(searchDefaultsData);

      setSearchObject({
        ...searchObject,
        price_end: newMaxPrice,
        size_end: newMaxSize
      });

      setDefaultSearchObject({
        ...defaultSearchObject,
        price_end: newMaxPrice,
        size_end: newMaxSize
      });
    }

    // Get search defaults
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        getSearchDefaults();
        return;
      }
      else {
        searchFragrances({
          ...searchObject,
          searchInput: searchInput
        });
      }

    }, [searchInput]);


    // Search fragrances again when defaultSearchObject is completed
    useEffect(
      () => {
        searchFragrances(defaultSearchObject);
      },
      [defaultSearchObject]
    );


    const [showSidebar, setShowSidebar] = useState(false);

    if (useOffcanvasFilters) {
      const showFilters = () => setShowSidebar(true);
      const hideFilters = () => setShowSidebar(false);

      return (
          <Container style={style}>
            <Row style={{
              height: '100%'
            }}>
            <Offcanvas show={showSidebar} onHide={hideFilters}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filters</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <FilterBar
                xs={12}
                searchObject={searchObject}
                setSearchObject={setSearchObject}
                searchFragrances={searchFragrances}
                defaultSearchObject={defaultSearchObject}
                searchDefaults={searchDefaults}
                useSidebarFilter={useOffcanvasFilters}
                hideFilters={hideFilters}
                />
              </Offcanvas.Body>
            </Offcanvas>
              <FragranceListings
              xs={12}
              fragranceListings={fragranceListings}
              showFilters={showFilters}
              useOffcanvasFilters={true}
              setSearchInput={setSearchInput}
              totalRows={totalRows.current}
              loadMoreListings={loadMoreListings}
              />
            </Row>
          </Container>
      );
    }
    else {
      return (
          <Container style={style}>
            <Row style={{
              height: '100%'
            }}>
              <FilterBar
              xs={4}
              searchObject={searchObject}
              setSearchObject={setSearchObject}
              searchFragrances={searchFragrances}
              defaultSearchObject={defaultSearchObject}
              searchDefaults={searchDefaults}
              />
              <FragranceListings
              xs={8}
              fragranceListings={fragranceListings}
              setSearchInput={setSearchInput}
              totalRows={totalRows.current}
              loadMoreListings={loadMoreListings}
              />
            </Row>
          </Container>
      );
    }
};

export default Browsing;