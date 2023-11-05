import React, {useEffect, useState, useRef, useCallback} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FilterBar from './FilterBar';
import FragranceListings from './FragranceListings';
import { sendGet } from '../utils/requests';
import Offcanvas from 'react-bootstrap/Offcanvas';

const SMALL_SCREEN_CUTOFF = 800;

const Browsing = ({style}) => {

    /*
    STATES
    */
    const [useOffcanvasFilters, setUseOffcanvasFilters] = useState(
      window.innerWidth < SMALL_SCREEN_CUTOFF
    );

    const [searchInput, setSearchInput] = useState('');
    const isFirstRender = useRef(true);
    const totalRows = useRef(0);
    const paginationPage = useRef(0);
    const [showSidebar, setShowSidebar] = useState(false);
    const [searchDefaults, setSearchDefaults] = useState({
      maxPrice: 1000,
      maxSize: 100,
      brands: []
    });
    const sortByOptions = {
      none: {
        val: '',
        name: 'None'
      },
      title_ASC: {
          val: 'title,ASC',
          name: 'Title (A -> Z)'
      },
      title_DESC: {
        val: 'title,DESC',
        name: 'Title (Z -> A)'
      },
      brand_ASC: {
        val: 'brand,ASC',
        name: 'Brand (A -> Z)'
      },
      brand_DESC: {
        val: 'brand,DESC',
        name: 'Brand (Z -> A)'
      },
      price_DESC: {
          val: 'price,DESC',
          name: 'Price (high -> low)'
      },
      price_ASC: {
          val: 'price,ASC',
          name: 'Price (low -> high)'
      },
      size_DESC: {
          val: 'sizeoz,DESC',
          name: 'Size (high -> low)'
      },
      size_ASC: {
          val: 'sizeoz,ASC',
          name: 'Size (low -> high)'
      },
    }
    const [sortBy, setSortBy] = useState(sortByOptions.none);

    const [defaultSearchObject, setDefaultSearchObject] = useState({
      priceStart: 0,
      priceEnd: searchDefaults.maxPrice,
      sizeStart: 0,
      sizeEnd: searchDefaults.maxSize,
      brands: searchDefaults.brands,
      gender: 'All',
      sortBy: sortBy.val,
      watchlisted: ''
    });

    const [searchObject, setSearchObject] = useState(defaultSearchObject);
    const [fragranceListings, setFragranceListings] = useState([]);
    const fragranceListingsRef = useRef(fragranceListings);

    /*
    FUNCTIONS
    */
    const showFilters = () => setShowSidebar(true);

    const hideFilters = () => setShowSidebar(false);

    const updateScreenState = () => {
        setUseOffcanvasFilters(
            window.innerWidth < SMALL_SCREEN_CUTOFF
        );
    };

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
        priceEnd: newMaxPrice,
        sizeEnd: newMaxSize
      });

      setDefaultSearchObject({
        ...defaultSearchObject,
        priceEnd: newMaxPrice,
        sizeEnd: newMaxSize
      });
    }

    /*
    EFFECTS
    */
    useEffect(() => {
        window.addEventListener('resize', updateScreenState);

        return () => {
            window.removeEventListener('resize', updateScreenState);
        }
    }, []);



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
          searchInput: searchInput,
          sortBy: sortBy.val
        });
      }

    }, [searchInput, sortBy]);


    // Search fragrances again when defaultSearchObject is completed
    useEffect(
      () => {
        searchFragrances(defaultSearchObject);
      },
      [defaultSearchObject]
    );

    const filterBarProps = {
      searchObject: searchObject,
      setSearchObject: setSearchObject,
      searchFragrances: searchFragrances,
      defaultSearchObject: defaultSearchObject,
      searchDefaults: searchDefaults,
      useSidebarFilter: useOffcanvasFilters,
      hideFilters: hideFilters
    }

    const fragranceListingsProps = {
      fragranceListings: fragranceListings,
      showFilters: showFilters,
      useOffcanvasFilters: useOffcanvasFilters,
      setSearchInput: setSearchInput,
      totalRows: totalRows.current,
      loadMoreListings: loadMoreListings,
      sortBy: sortBy,
      setSortBy: setSortBy,
      sortByOptions: sortByOptions
    }

    if (useOffcanvasFilters) {


      return (
          <Container style={style}>
            <Row style={{
              height: '100%'
            }}>
            <Offcanvas show={showSidebar} onHide={hideFilters}>
              <Offcanvas.Header closeButton style={{
                display: 'flex',
                justifyContent: 'end'
              }}/>
              <Offcanvas.Body>
                <FilterBar
                xs={12}
                {...filterBarProps}
                />
              </Offcanvas.Body>
            </Offcanvas>
              <FragranceListings
              xs={12}
              {...fragranceListingsProps}
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
              {...filterBarProps}
              />
              <FragranceListings
              xs={8}
              {...fragranceListingsProps}
              />
            </Row>
          </Container>
      );
    }
};

export default Browsing;