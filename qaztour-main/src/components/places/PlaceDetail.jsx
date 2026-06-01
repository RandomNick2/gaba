import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Chip,
  Divider,
  Rating,
  Paper,
  CircularProgress,
  Container,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet стилдерін импорттау
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импорты

// --- Styled Components ---
const GalleryImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  borderRadius: theme.spacing(1),
  objectFit: 'cover',
}));

// --- Helper function for image URL ---
const BASE_URL = 'http://127.0.0.1:8000/storage/';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${encodeURIComponent(imagePath)}`;
};

const PlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation(); // ✅ i18n объектісін аламыз

  useEffect(() => {
    const fetchPlaceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
            `https://cloud-aventra-kz.onrender.com/api/places/${id}`
        );
        console.log('API Response for PlaceDetail:', response.data);
        // ✅ API жауабында place дерегі тікелей response.data-да келеді деп болжаймыз
        const fetchedPlace = response.data;
        if (fetchedPlace) {
          setPlace(fetchedPlace);
        } else {
          setError(t('places_detail.place_not_found_message')); // Локализация
        }
      } catch (err) {
        console.error('Көрікті орынды жүктеу кезінде қате кетті:', err);
        setError(
            err.message || t('places_detail.failed_to_load_place') // Локализация
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [id, t]); // ✅ 't' функциясын тәуелділікке қосу

  useEffect(() => {
    // Leaflet icon bug fix for Webpack
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Картаны орталықтандыру және масштабтау үшін көмекші компонент
  const ResetMapView = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      // Картаны жаңартуды қамтамасыз ету
      map.invalidateSize();
      map.setView([lat, lng], 13);
    }, [map, lat, lng]);
    return null;
  };

  // API-да name_kk, description_kk жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  // --- ШАРТТЫ РЕНДЕРЛЕУ (CONDITIONAL RENDERING) ---
  if (loading) {
    return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
          <Typography mt={2}>{t('places_detail.loading')}</Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            {t('places_detail.error')}: {error}
          </Typography>
        </Container>
    );
  }

  if (!place) {
    return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h5" color="warning">
            {t('places_detail.notfound')}
          </Typography>
        </Container>
    );
  }

  // ✅ Орын деректерін локализациялау
  const placeName =
      place[`name_${effectiveLang}`] || place.name_kz || place.name_en || t('places_detail.no_name');
  const placeDescription =
      place[`description_${effectiveLang}`] || place.description_kz || place.description_en || t('places_detail.no_description');
  const placeCity = place.city?.name || place.city_id || t('places_detail.unknown_city'); // Егер API-дан city объектісі келсе
  const placeCountry = place.country || t('places_detail.unknown_country');

  // Картаға арналған координаттарды дайындау
  const lat = parseFloat(place.lat);
  const lng = parseFloat(place.lng);
  const hasCoordinates = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  return (
      <Container sx={{ py: 14 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {placeName} {/* ✅ Локализацияланған атау */}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {placeCity}, {placeCountry} {/* ✅ Локализацияланған қала мен ел */}
        </Typography>

        {/* Галерея */}
        <Grid container spacing={2} mb={4}>
          {place.images && place.images.length > 0 ? (
              place.images.map((imgUrl, index) => ( // imgUrl тікелей жол немесе {image_path: '...'} объектісі болуы мүмкін
                  <Grid item xs={12} sm={4} key={index}>
                    <GalleryImage
                        image={getImageUrl(imgUrl)}
                        title={`${t('places_detail.image')} ${index + 1}`} // ✅ Локализацияланған тақырып
                    />
                  </Grid>
              ))
          ) : (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {t('places_detail.no_images_found')} {/* ✅ Локализация */}
                </Typography>
              </Grid>
          )}
        </Grid>

        {/* Негізгі сипаттама */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('places_detail.overview')} {/* ✅ Локализация */}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {placeDescription} {/* ✅ Локализацияланған сипаттама */}
          </Typography>
        </Paper>

        {/* Рейтинг */}
        <Box display="flex" alignItems="center" mb={2}>
          <Rating
              value={parseFloat(place.rating) || 0}
              precision={0.1}
              readOnly
          />
          <Typography variant="body2" ml={1}>
            {parseFloat(place.rating) || 0} / 5
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Қызметтер немесе қосымша мәліметтер */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            {t('places_detail.information')} {/* ✅ Локализация */}
          </Typography>
          {place.things_to_do &&
          typeof place.things_to_do === 'string' &&
          place.things_to_do.length > 0 ? (
              <Grid container spacing={1}>
                {place.things_to_do.split(',').map((item, index) => (
                    <Grid item key={index}>
                      <Chip label={item.trim()} sx={{ mr: 1, mb: 1 }} /> {/* Chip мәтінін локализациялау үшін, API-да things_to_do_kz/en керек */}
                    </Grid>
                ))}
              </Grid>
          ) : (
              <Typography variant="body2" color="text.secondary">
                {t('places_detail.notfound_information')} {/* ✅ Локализация */}
              </Typography>
          )}
        </Box>

        {/* Карта */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            {t('places_detail.location')} {/* ✅ Локализация */}
          </Typography>

          {hasCoordinates ? (
              <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer
                    center={[lat, lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    key={place.id}
                >
                  <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lng]}>
                    <Popup>{placeName}</Popup> {/* ✅ Локализацияланған атау */}
                  </Marker>
                  <ResetMapView lat={lat} lng={lng} />
                </MapContainer>
              </Box>
          ) : (
              <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                  }}
              >
                <Typography color="text.secondary">
                  {t('places_detail.no_coordinates')} {/* ✅ Локализация */}
                </Typography>
              </Box>
          )}
        </Box>
      </Container>
  );
};

export default PlaceDetail;