import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Rating,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импорты

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = 'http://127.0.0.1:8000/storage/';
  const { t, i18n } = useTranslation(); // ✅ i18n объектісін аламыз

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://cloud-aventra-kz.onrender.com/api/hotels');
        console.log('Hotel List API Response:', response.data);

        // ✅ API жауабындағы қонақүй деректерін дұрыс өңдейміз
        const fetchedHotels = response.data?.hotels?.data || [];
        setHotels(fetchedHotels);

      } catch (err) {
        console.error('Қонақүйлерді жүктеу кезінде қате кетті:', err);
        setError(err.message || t('hotel_list.error_loading_hotels')); // Локализацияланған қате
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [t]); // ✅ 't' функциясын тәуелділікке қосу, себебі ол тіл өзгергенде қате хабарламасын аудара алады

  const handleGoBack = () => {
    navigate(-1);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image'; // Сурет жоқ болса
    if (imagePath.startsWith('http')) return imagePath; // Егер толық URL болса
    return `${BASE_URL}${imagePath}`; // Базалық URL қосу
  };

  // --- ШАРТТЫ РЕНДЕРЛЕУ (CONDITIONAL RENDERING) ---
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
            {t('hotel_list.error')}: {error}
          </Typography>
        </Container>
    );
  }

  // API-да address_kk немесе description_kk жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  return (
      <Container sx={{ py: 14 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleGoBack} sx={{ mr: 1 }}> {/* mb:2 орнына mr:1 */}
            <ArrowBackIosIcon />
          </IconButton>
          {t('hotel_list.list_hotel')}
        </Typography>
        <Grid container spacing={3}>
          {hotels.length > 0 ? (
              hotels.map((hotel) => (
                  <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                    <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 6,
                          boxShadow: 3, // Қосымша көлеңке
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)', // Жоғары жылжу эффектісі
                          },
                        }}
                        onClick={() => navigate(`/hotels/${hotel.id}`)} // ✅ window.location.href орнына navigate қолдану
                    >
                      <CardMedia
                          component="img"
                          height="180" // Сурет биіктігін үлкейту
                          image={getImageUrl(hotel.image)}
                          alt={hotel.name || t('hotel_list.no_name')} // ✅ Локализацияланған alt
                          sx={{ objectFit: 'cover' }} // Суреттің дұрыс көрсетілуі
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}> {/* padding-ті үлкейту */}
                        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                          {hotel.name || t('hotel_list.no_name')} {/* name_kz/name_en API-да жоқ, сондықтан name-ді қолданамыз */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} />{' '}
                          {/* ✅ Мекенжайды локализациялау */}
                          {hotel[`address_${effectiveLang}`] || hotel.address_kz || hotel.address_en || t('hotel_list.unknown_address')}, {hotel.city?.name || hotel.city_id || t('hotel_list.unknown_city')}, {hotel.country || t('hotel_list.unknown_country')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {/* ✅ Сипаттаманы локализациялау және қысқарту */}
                          {(hotel[`description_${effectiveLang}`] || hotel.description_kz || hotel.description_en || t('hotel_list.no_description'))
                              .substring(0, 100)
                          }...
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Rating
                              name={`hotel-rating-${hotel.id}`}
                              value={hotel.rating || 0} // Рейтинг болмаса 0
                              precision={0.1}
                              readOnly
                              size="small"
                          />
                          <Typography variant="caption" color="text.secondary" ml={0.5}>
                            ({hotel.rating || 0})
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" mt={1} fontWeight="bold" color="primary.main">
                          ${hotel.price_per_night || 'N/A'} / {t('hotel_list.night')}
                        </Typography>
                      </CardContent>
                      <Box
                          sx={{
                            p: 2,
                            pt: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'flex-start' // Бұл қасиет Box ішіндегі элементтерді көлденеңінен туралайды
                          }}
                      >
                        {hotel.phone && (
                            <Button
                                size="small"
                                color="primary"
                                startIcon={<PhoneIcon />}
                                href={`tel:${hotel.phone}`}
                                // fullWidth // ✅ БҰЛ ЖОЛДЫ АЛЫП ТАСТАҢЫЗ!
                                sx={{ justifyContent: 'flex-start' }} // ✅ Батырма ішіндегі контентті солға туралайды
                            >
                              {hotel.phone}
                            </Button>
                        )}
                        {hotel.email && (
                            <Button
                                size="small"
                                color="secondary"
                                startIcon={<EmailIcon />}
                                href={`mailto:${hotel.email}`}
                                // fullWidth // ✅ БҰЛ ЖОЛДЫ АЛЫП ТАСТАҢЫЗ!
                                sx={{ justifyContent: 'flex-start' }} // ✅ Батырма ішіндегі контентті солға туралайды
                            >
                              {hotel.email}
                            </Button>
                        )}
                        {hotel.website && (
                            <Button
                                size="small"
                                color="info"
                                startIcon={<PublicIcon />}
                                href={hotel.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                // fullWidth // ✅ БҰЛ ЖОЛДЫ АЛЫП ТАСТАҢЫЗ!
                                sx={{ justifyContent: 'flex-start' }} // ✅ Батырма ішіндегі контентті солға туралайды
                            >
                              {t('hotel_list.web_site')}
                            </Button>
                        )}
                      </Box>
                    </Card>
                  </Grid>
              ))
          ) : (
              <Grid item xs={12}>
                <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '30vh',
                      width: '100%',
                    }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {t('hotel_list.no_hotels_found')}
                  </Typography>
                </Box>
              </Grid>
          )}
        </Grid>
      </Container>
  );
};

export default HotelList;