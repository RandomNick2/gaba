import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  CircularProgress,
  Rating,
  Divider,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'http://127.0.0.1:8000/storage/';
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/hotels/${id}`
        );
        console.log('Hotel Detail API Response:', response.data);

        if (response.status !== 200) {
          throw new Error(t('hotel_detail.error_loading_hotel_status'));
        }
        const fetchedHotel = response.data?.hotels;
        if (fetchedHotel) {
          setHotel(fetchedHotel);
        } else {
          setError(t('hotel_detail.hotel_not_found'));
        }
      } catch (err) {
        console.error('Қонақүйді жүктеу кезінде қате кетті:', err);
        setError(
            err.message || t('hotel_detail.failed_to_fetch_details')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, t]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookNow = (roomId) => {
    navigate(`/hotel-booking/${hotel.id}/room/${roomId}`);
  };

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
            {t('hotel_detail.error')}: {error}
          </Typography>
        </Container>
    );
  }

  if (!hotel) {
    return (
        <Container sx={{ py: 8 }}>
          <Typography variant="h6">{t('hotel_detail.hotel_not_found')}</Typography>
        </Container>
    );
  }

  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  const hotelName = hotel.name || t('hotel_detail.no_name');
  const hotelAddress =
      hotel[`address_${effectiveLang}`] || hotel.address_kz || hotel.address_en || t('hotel_detail.unknown_address');
  const hotelDescription =
      hotel[`description_${effectiveLang}`] || hotel.description_kz || hotel.description_en || t('hotel_detail.no_description');
  const hotelCity = hotel.city?.name || hotel.city_id || t('hotel_detail.unknown_city');
  const hotelCountry = hotel.country || t('hotel_detail.unknown_country');

  return (
      <Container sx={{ py: 14 }}>
        <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
          <ArrowBackIosIcon />
        </IconButton>
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardMedia
              component="img"
              alt={hotelName}
              height="400"
              image={getImageUrl(hotel.image)}
              sx={{ objectFit: 'cover' }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography gutterBottom variant="h4" component="h2" fontWeight="bold">
              {hotelName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} />{' '}
              {hotelAddress}, {hotelCity}, {hotelCountry}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Rating
                  name={`hotel-rating-${hotel.id}`}
                  value={parseFloat(hotel.rating) || 0}
                  precision={0.1}
                  readOnly
              />
              <Typography variant="body2" color="text.secondary" ml={0.5}>
                ({hotel.rating || 0})
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {hotelDescription}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
              {hotel.price_per_night || 'N/A'} ₸ / {t('hotel_detail.night')}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Бөлмелерді көрсету */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('hotel_detail.room_types_heading')}
            </Typography>
            {hotel.room_types && hotel.room_types.length > 0 ? (
                hotel.room_types.map((room) => (
                    <Card key={room.id} sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
                      <CardMedia
                          component="img"
                          alt={room[`name_${effectiveLang}`] || room.name_kz || room.name_en || t('hotel_detail.no_name_room')} // ✅ Бөлме атауын локализациялау
                          height="200"
                          image={getImageUrl(room.image)} // Бөлме суреті бар деп болжаймыз
                          sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                          {room[`name_${effectiveLang}`] || room.name_kz || room.name_en || t('hotel_detail.no_name_room')} {/* ✅ Бөлме атауын локализациялау */}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">
                          {parseFloat(room.price_per_night).toLocaleString('kk-KZ')} ₸ / {t('hotel_detail.night')} {/* ✅ Бағаны форматтау */}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                          {t('hotel_detail.max_guests')}: {room.max_guests || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom> {/* ✅ Сипаттаманы қосу */}
                          {(room[`description_${effectiveLang}`] || room.description_kz || room.description_en || t('hotel_detail.no_description_room'))} {/* Сипаттаманы қысқарту */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('hotel_detail.available_rooms')}: {room.available_rooms || 'N/A'}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleBookNow(room.id)}
                        >
                          {t('hotel_detail.book_now_button')}
                        </Button>
                      </Box>
                    </Card>
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('hotel_detail.no_room_types_found')}
                </Typography>
            )}

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
              {hotel.phone && (
                  <Button color="primary" startIcon={<PhoneIcon />} href={`tel:${hotel.phone}`} fullWidth={false}>
                    {hotel.phone}
                  </Button>
              )}
              {hotel.email && (
                  <Button color="secondary" startIcon={<EmailIcon />} href={`mailto:${hotel.email}`} fullWidth={false}>
                    {hotel.email}
                  </Button>
              )}
              {hotel.website && (
                  <Button
                      color="info"
                      startIcon={<PublicIcon />}
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth={false}
                  >
                    {t('hotel_detail.web_site')}
                  </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />
      </Container>
  );
};

export default HotelDetail;