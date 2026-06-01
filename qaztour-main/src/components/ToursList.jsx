import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  ImageListItem,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Slider,
  CircularProgress,
  Rating,
  useMediaQuery, // ✅ useMediaQuery импортталды
  useTheme, // ✅ useTheme импортталды
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import tourImg from './../assets/photos/5ftsj0mn7lkw08ws40k4w4wss.jpg';
import { useTranslation } from 'react-i18next';


const ToursList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [locations, setLocations] = useState([]); // ✅ Локациялар тізімін сақтау үшін
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const BASE_URL = 'http://127.0.0.1:8000/storage/';
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialDate = searchParams.get('date') || '';
  const initialPeople = searchParams.get('people') || '';
  const initialStartDate = searchParams.get('startDate') || '';
  const initialEndDate = searchParams.get('endDate') || '';

  // API-дан турлар мен локацияларды жүктеу
  useEffect(() => {
    console.log('TOURS LIST: useEffect triggered. Current language:', i18n.language);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Турларды жүктеу
        const toursResponse = await axios.get('https://cloud-aventra-kz.onrender.com/api/tours', {
          params: {
            search: initialSearch,
            date: initialDate,
            ...(initialPeople && { people: initialPeople }),
            startDate: initialStartDate,
            endDate: initialEndDate,
          },
        });
        const fetchedTours = toursResponse.data?.data?.data || [];

        // 2. Локацияларды жүктеу
        const locationsResponse = await axios.get('http://127.0.0.1:8000/api/locations');
        const fetchedLocations = locationsResponse.data.data || locationsResponse.data || [];
        setLocations(fetchedLocations); // ✅ Локацияларды күйге сақтау


        setTours(fetchedTours);
        const prices = fetchedTours.map(tour => Number(tour.price));
        if (prices.length > 0) {
          const calculatedMaxPrice = Math.max(...prices);
          setMaxPrice(calculatedMaxPrice);
          if (priceRange[1] > calculatedMaxPrice) {
            setPriceRange([priceRange[0], calculatedMaxPrice]);
          }
        } else {
          setMaxPrice(500000);
        }

      } catch (err) {
        console.error('Error fetching data for ToursList:', err);
        setError(err.message || t('tours_list_page.failed_to_fetch_tours'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialSearch, initialDate, initialPeople, initialStartDate, initialEndDate, t, i18n.language]);

  useEffect(() => {
    const filterAndSort = () => {
      const effectiveLang = currentLang === 'kk' ? 'kz' : currentLang;

      const filtered = tours.filter((tour) => {
        const localizedName = tour[`name_${effectiveLang}`] || tour.name_en || tour.name_kz || '';
        const localizedDescription = tour[`description_${effectiveLang}`] || tour.description_en || tour.description_kz || '';

        const matchesSearch = searchQuery
            ? localizedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            localizedDescription.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        const matchesCategory = selectedCategory ? (tour.category === selectedCategory) : true;

        const matchesDuration = selectedDuration
            ? selectedDuration === '1-3'
                ? (tour.duration >= 1 && tour.duration <= 3)
                : selectedDuration === '4-7'
                    ? (tour.duration >= 4 && tour.duration <= 7)
                    : selectedDuration === '7+'
                        ? (tour.duration > 7)
                        : true
            : true;

        const matchesPrice =
            Number(tour.price) >= priceRange[0] &&
            Number(tour.price) <= priceRange[1];

        const matchesPeople = initialPeople
            ? (tour.volume ? tour.volume >= Number(initialPeople) : true)
            : true;

        const matchesDateRange =
            initialStartDate && initialEndDate
                ? (new Date(tour.date) >= new Date(initialStartDate) &&
                    new Date(tour.date) <= new Date(initialEndDate))
                : true;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesDuration &&
            matchesPrice &&
            matchesPeople &&
            matchesDateRange
        );
      });

      const sorted = [...filtered].sort((a, b) => {
        let comparison = 0;
        const effectiveLang = currentLang === 'kk' ? 'kz' : currentLang;

        if (sortBy === 'price') {
          comparison = Number(a.price) - Number(b.price);
        } else if (sortBy === 'location') {
          const locationA = locations.find(loc => loc.id === a.location_id);
          const locationB = locations.find(loc => loc.id === b.location_id);

          const localizedLocationA = locationA ? (locationA[`name_${effectiveLang}`] || locationA.name_kz || locationA.name_en || '') : '';
          const localizedLocationB = locationB ? (locationB[`name_${effectiveLang}`] || locationB.name_kz || locationB.name_en || '') : '';

          comparison = localizedLocationA.localeCompare(localizedLocationB);
        } else if (sortBy === 'date') {
          comparison = new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'name') {
          const nameA = a[`name_${effectiveLang}`] || a.name_kz || a.name_en || '';
          const nameB = b[`name_${effectiveLang}`] || b.name_kz || b.name_en || '';
          comparison = nameA.localeCompare(nameB);
        } else if (sortBy === 'rating') {
          comparison = calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews);
        }
        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
      setFilteredTours(sorted);
    };

    filterAndSort();
  }, [
    tours,
    locations, // ✅ locations-ты тәуелділікке қосу
    initialSearch,
    initialStartDate,
    initialEndDate,
    initialPeople,
    priceRange,
    selectedCategory,
    selectedDuration,
    searchQuery,
    sortBy,
    sortDirection,
    currentLang
  ]);

  const handlePriceChange = (event, newValue) => { setPriceRange(newValue); };
  const handleCategoryChange = (event) => { setSelectedCategory(event.target.value); };
  const handleDurationChange = (event) => { setSelectedDuration(event.target.value); };
  const handleSearchChange = (event) => { setSearchQuery(event.target.value); };

  const handleSortChange = (event) => {
    const value = event.target.value;
    if (value === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) { return 0; }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return tourImg;
    if (imagePath.startsWith('http')) return imagePath;
    return `<span class="math-inline">\{BASE\_URL\}</span>{imagePath}`;
  };

  if (loading) {
    return (
        <Container sx={{ paddingY: 14 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
            <Typography ml={2}>{t('common.loading_tours')}</Typography>
          </Box>
        </Container>
    );
  }

  if (error) {
    return (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 5, color: 'error.main' }}>
          {t('common.error')}: {error}
        </Typography>
    );
  }

  const effectiveLang = currentLang === 'kk' ? 'kz' : currentLang;

  // ✅ Локацияларды локализациялау (locations күйінен аламыз)
  const localizedLocations = locations.map(loc => ({
    ...loc,
    localizedName: loc[`name_${currentLang}`] || loc.name_en || loc.name_kz || loc.name,
  }));

  return (
      <>
        <Box marginBottom={3}>
          <img
              style={{ width: '100%', borderRadius: '10px' }}
              src={tourImg}
              alt={t('tours_list_page.tour_banner_alt')}
          />
        </Box>
        <Container sx={{ paddingX: isMobile ? 1 : 3 }}>
          <Grid container spacing={isMobile ? 1 : 3}>
            {/* Filters */}
            <Grid
                item
                xs={12}
                md={3}
                sx={{
                  position: isMobile ? 'static' : 'sticky',
                  top: isMobile ? 'auto' : 80,
                  height: isMobile ? 'auto' : '100vh',
                  overflowY: isMobile ? 'visible' : 'auto',
                }}
            >
              <Card
                  sx={{
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                    padding: isMobile ? 1 : 2,
                    borderRadius: '15px',
                  }}
              >
                <CardContent>
                  <TextField
                      fullWidth
                      label={t('tours_list_page.search_tours')}
                      variant="outlined"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      margin="normal"
                      size={isMobile ? "small" : "medium"}
                  />

                  {/* ✅ Категорияны сүзу (API-дан келетін деректерге байланысты) */}
                  {/* Егер категориялар API-дан келетін болса, оларды да locations сияқты жүктеу керек */}
                  {/* Қазіргі кодта categories массиві жоқ, сондықтан бұл түймесі қате шығаруы мүмкін. */}
                  {/* Мысал үшін, егер categories API-дан келетін болса: */}
                  {/*
                  <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
                      <InputLabel id="category-select-label">{t('tours_list_page.category')}</InputLabel>
                      <Select
                          labelId="category-select-label"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                          label={t('tours_list_page.category')}
                      >
                          <MenuItem value="">{t('tours_list_page.all_categories')}</MenuItem>
                          {categories.map((cat) => (
                              <MenuItem key={cat.id} value={cat.id}>
                                  {cat[`name_${currentLang}`] || cat.name_en || cat.name_kz || cat.name}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  */}

                  <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
                    <InputLabel id="duration-select-label">
                      {t('tours_list_page.duration_days')}
                    </InputLabel>
                    <Select
                        labelId="duration-select-label"
                        value={selectedDuration}
                        onChange={handleDurationChange}
                        label={t('tours_list_page.duration_days')}
                    >
                      <MenuItem value="">{t('tours_list_page.all_durations')}</MenuItem>
                      <MenuItem value="1-3">1-3 {t('tours_list_page.days')}</MenuItem>
                      <MenuItem value="4-7">4-7 {t('tours_list_page.days')}</MenuItem>
                      <MenuItem value="7+">7+ {t('tours_list_page.days')}</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <Typography variant="body1" sx={{ mb: 1, fontSize: isMobile ? '0.85rem' : '1rem' }}>
                      {t('tours_list_page.price_range')}: ₸{priceRange[0]} - ₸{priceRange[1]}
                    </Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={maxPrice}
                        step={10000}
                        valueLabelFormat={(value) => `₸${value}`}
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
                    <InputLabel id="sort-by-label">
                      {t('tours_list_page.sort_by')}
                    </InputLabel>
                    <Select
                        labelId="sort-by-label"
                        value={sortBy}
                        onChange={handleSortChange}
                        label={t('tours_list_page.sort_by')}
                    >
                      <MenuItem value="">{t('tours_list_page.default')}</MenuItem>
                      <MenuItem value="name">{t('tours_list_page.name')}</MenuItem>
                      <MenuItem value="price">{t('tours_list_page.price')}</MenuItem>
                      <MenuItem value="date">{t('tours_list_page.date')}</MenuItem>
                      <MenuItem value="location">{t('tours_list_page.location')}</MenuItem>
                      <MenuItem value="rating">{t('tours_list_page.rating')}</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Tours List */}
            <Grid item xs={12} md={9} container spacing={isMobile ? 1 : 3}>
              {Array.isArray(filteredTours) && filteredTours.length > 0 ? (
                  filteredTours.map((tour) => (
                      <Grid item xs={12} sm={6} md={4} key={tour.id}>
                        <Card
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                              borderRadius: '15px',
                              overflow: 'hidden',
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                              },
                            }}
                            onClick={() => navigate(`/tour/${tour.id}`)}
                        >
                          <ImageListItem sx={{ mb: 0 }}>
                            <img
                                src={getImageUrl(tour.image)}
                                alt={tour[`name_${effectiveLang}`] || tour.name_en || tour.name_kz || t('tours_list_page.no_name')}
                                style={{
                                  width: '100%',
                                  height: isMobile ? '150px' : '200px',
                                  objectFit: 'cover',
                                  borderRadius: '10px',
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = tourImg;
                                }}
                            />
                          </ImageListItem>

                          <CardContent sx={{ paddingTop: 0, paddingBottom: 1 }}>
                            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                              {tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('tours_list_page.no_name')}
                            </Typography>
                            <Typography variant={isMobile ? "body2" : "subtitle2"} color="text.secondary">
                              {/* ✅ Локация атауын localizedCities массивінен табу */}
                              {localizedLocations.find(loc => loc.id === tour.location_id)?.localizedName || t('tours_list_page.unknown_location')}
                            </Typography>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                color="text.secondary"
                                sx={{ mt: 0.5, mb: 1, height: isMobile ? 'auto' : '60px', overflow: 'hidden' }}
                            >
                              {tour[`description_${effectiveLang}`]?.length > 80
                                  ? `${(tour[`description_${effectiveLang}`] || tour.description_kz || tour.description_en || '').substring(0, 80)}...`
                                  : (tour[`description_${effectiveLang}`] || tour.description_kz || tour.description_en || t('tours_list_page.no_description'))}
                            </Typography>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <Rating
                                  name={`tour-rating-${tour.id}`}
                                  value={calculateAverageRating(tour.reviews)}
                                  precision={0.1}
                                  readOnly
                                  size="small"
                              />
                              <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  ml={0.5}
                              >
                                ({tour.reviews?.length || 0})
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {t('tours_list_page.date')}: {new Date(tour.date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}
                            </Typography>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                sx={{ color: '#ff9800', fontWeight: 'bold', mt: 1 }}
                            >
                              ₸{parseFloat(tour.price).toLocaleString('kk-KZ')}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                  ))
              ) : (
                  <Container sx={{ paddingY: 14 }}>
                    <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '50vh',
                        }}
                    >
                      {loading ? (
                          <CircularProgress />
                      ) : (
                          <Typography variant="h6" color="text.secondary">
                            {t('tours_list_page.no_tours_found_criteria')}
                          </Typography>
                      )}
                    </Box>
                  </Container>
              )}
            </Grid>
          </Grid>
        </Container>
      </>
  );
};

export default ToursList;