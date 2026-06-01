import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SectionTitle from './SectionTitle';
import SectionSubtitle from './SectionSubtitle';
import { useTranslation } from 'react-i18next';

// Styled Card (TourList-тен алынғандай)
const StyledCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.shadows[10],
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    '& .overlay': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))',
  color: '#fff',
  transition: '0.3s ease',
  transform: 'translateY(100%)',
  opacity: 0,
}));

// API storage URL
const BASE_URL = 'http://127.0.0.1:8000/storage/';

const PlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Сурет URL-ін алу үшін көмекші функция
  const getImageUrl = (images) => {
    if (!images || images.length === 0) {
      return 'https://via.placeholder.com/300x200?text=No+Image'; // Әдепкі сурет
    }
    // API-да images массивінің ішінде { image_path: '...' } объектілері келуі мүмкін
    const firstImage = images[0]?.image_path || images[0];

    if (!firstImage) return 'https://via.placeholder.com/300x200?text=No+Image';

    if (firstImage.startsWith('http')) {
      return firstImage;
    }
    return `${BASE_URL}${encodeURIComponent(firstImage)}`;
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://cloud-aventra-kz.onrender.com/api/places');
        console.log('API response for Places:', response.data); // Бұл жерден құрылымды қараңыз

        // ✅ ӨЗГЕРІС БҰЛ ЖЕРДЕ: response.data тікелей массив болғандықтан
        setPlaces(response.data || []);

      } catch (err) {
        console.error('Орындарды жүктеу кезінде қате кетті:', err);
        setError(err.message || t('places.failed_to_load_places'));
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [t, i18n.language]);

  // API-да name_kk, description_kk жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  if (loading) {
    return (
        <Container sx={{ py: 8 }}>
          <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
              }}
          >
            <CircularProgress />
          </Box>
        </Container>
    );
  }

  if (error) {
    return (
        <Container sx={{ py: 8 }}>
          <Typography variant="h6" color="error">
            {t('places.error')}: {error}
          </Typography>
        </Container>
    );
  }

  return (
      <Container sx={{ pt: 14 }}>
        <SectionTitle>🇰🇿 {t('places.title')}</SectionTitle>
        <SectionSubtitle>
          {t('places.description')}
        </SectionSubtitle>

        <Grid container spacing={isMobile ? 2 : 4}>
          {places.length > 0 ? (
              places.map((place) => (
                  <Grid item xs={12} sm={6} md={4} key={place.id}>
                    <StyledCard>
                      <CardMedia
                          component="img"
                          height={250}
                          image={getImageUrl(place.images)}
                          alt={place[`name_${effectiveLang}`] || place.name_kz || place.name_en || t('places.no_name')}
                          sx={{ objectFit: 'cover' }}
                      />

                      <CardOverlay className="overlay">
                        <Typography variant="h6" fontWeight="bold">
                          {place[`name_${effectiveLang}`] || place.name_kz || place.name_en || t('places.no_name')}
                        </Typography>
                        <Typography variant="body2" mb={1}>
                          {place.city?.name || place.city_id || t('places.unknown_city')}, {place.country || t('places.unknown_country')}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Rating
                              value={parseFloat(place.rating) || 0}
                              precision={0.1}
                              readOnly
                              size="small"
                          />
                          <Typography variant="caption" ml={1}>
                            {parseFloat(place.rating) || 0} / 5
                          </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            component={Link}
                            to={`/place/${place.id}`}
                        >
                          {t('places.more_details_button')}
                        </Button>
                      </CardOverlay>
                    </StyledCard>
                  </Grid>
              ))
          ) : (
              !loading && !error && (
                  <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        textAlign="center"
                        mt={4}
                    >
                      {t('places.notfound')}
                    </Typography>
                  </Grid>
              )
          )}
        </Grid>
        <br />
        <br />
      </Container>
  );
};

export default PlacesList;