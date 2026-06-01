import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Container,
  Alert, // Alert компонентын импорттау
  Snackbar, // Snackbar компонентын импорттау
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импорты

// Header және Footer компоненттері, олардың ішкі логикасы өзгеріссіз қалады
// import Header from './Header';
// import Footer from './Footer';


const HotelBooking = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(); // ✅ i18n объектісін аламыз
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId'); // userId null болмауын қамтамасыз етіңіз немесе әдепкі мән беріңіз

  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  // Хабарламаларды көрсету функциясы
  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  useEffect(() => {
    // userId-ді localStorage-дан алғаннан кейін тексеріңіз
    if (!userId) {
      // showAlert('warning', t('hotel_booking_page.user_id_not_found')); // Егер userId міндетті болса
      // navigate('/login'); // Қолданушыны логинге бағыттау
      // return;
    }

    axios
        .get(`http://127.0.0.1:8000/api/hotels/${hotelId}/book/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // API жауабының құрылымын консольдан тексеріңіз!
          // response.data.hotel, response.data.room_type болуы керек
          setHotelData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(
              'Қате шықты:',
              error.response ? error.response.data : error.message
          );
          showAlert('error', error.response?.data?.message || t('hotel_booking_page.failed_to_load_hotel_data')); // Локализация
          setLoading(false);
        });
  }, [hotelId, roomId, token, t]); // ✅ 't' функциясын тәуелділікке қосу

  const handleSubmit = async () => {
    if (!checkIn || !checkOut) {
      showAlert('error', t('hotel_booking_page.please_fill_dates')); // Локализация
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const nights =
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      showAlert('error', t('hotel_booking_page.invalid_dates_selected')); // Локализация
      return;
    }

    const priceTotal = nights * hotelData.room_type.price_per_night;

    const payload = {
      user_id: userId,
      hotel_id: hotelData.hotel.id,
      room_type_id: hotelData.room_type.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests_count: guests,
      notes,
      price_total: priceTotal,
      status: 'pending',
    };

    try {
      const response = await axios.post(
          'http://127.0.0.1:8000/api/bookings/',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );

      const bookingId = response.data?.booking?.id;

      showAlert('success', t('hotel_booking_page.booking_successful')); // Локализация
      if (bookingId) {
        navigate(`/booking-room/${bookingId}`);
      } else {
        console.error('Қате: bookingId жоқ');
        showAlert('error', t('hotel_booking_page.error_booking_id_missing')); // Локализация
      }
    } catch (error) {
      console.error('Қате:', error.response?.data || error.message);
      showAlert('error', error.response?.data?.message || t('hotel_booking_page.error_occurred_check_data')); // Локализация
    }
  };

  if (loading) {
    return (
        <Container sx={{ paddingY: 14 }}>
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

  if (!hotelData) {
    return (
        <Typography sx={{ mt: 12, textAlign: 'center' }}>
          {t('hotel_booking_page.notfound_info')}
        </Typography>
    );
  }

  const { hotel, room_type } = hotelData;

  // API-да name_kk, address_kk, description_kk сияқты кілттер жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  // Қонақүй деректерін локализациялау
  const hotelName = hotel?.name || t('hotel_booking_page.no_name');
  const hotelDescription = hotel?.[`description_${effectiveLang}`] || hotel?.description_kz || hotel?.description_en || t('hotel_booking_page.no_description');

  // Бөлме типінің деректерін локализациялау
  const roomTypeName = room_type?.[`name_${effectiveLang}`] || room_type?.name_kz || room_type?.name_en || t('hotel_booking_page.no_name_room');
  const roomTypeDescription = room_type?.[`description_${effectiveLang}`] || room_type?.description_kz || room_type?.description_en || t('hotel_booking_page.no_description_room');


  const nights =
      checkIn && checkOut
          ? (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          : 0;
  const totalPrice = nights * (room_type?.price_per_night || 0); // price_per_night null болуы мүмкін, 0-ге әдепкілендіру


  return (
      <>
        {/* <Header /> */} {/* Header мен Footer компоненттері бұл жердегі өзгерістерге қатысты емес */}
        <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                fontWeight="bold"
            >
              {t('hotel_booking_page.new_booking')}
            </Typography>

            <Box mb={2}>
              <Typography>
                <strong>{t('hotel_booking_page.hotel_name')}:</strong> {hotelName}
              </Typography>
              <Typography>
                <strong>{t('hotel_booking_page.room')}:</strong> {roomTypeName}
              </Typography>
              <Typography>
                <strong>{t('hotel_booking_page.price_for_night')}:</strong> {room_type?.price_per_night || 'N/A'} ₸
              </Typography>
              <Typography>
                <strong>{t('hotel_booking_page.max_guests')}:</strong> {room_type?.max_guests || 'N/A'}
              </Typography>
              <Typography>
                <strong>{t('hotel_booking_page.available_rooms')}:</strong>{' '}
                {room_type?.available_rooms || 'N/A'}
              </Typography>
              <Typography>
                <strong>{t('hotel_booking_page.description')}:</strong> {roomTypeDescription}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                    label={t('hotel_booking_page.check_in_date')}
                    type="date"
                    fullWidth
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    label={t('hotel_booking_page.check_out_date')}
                    type="date"
                    fullWidth
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    label={t('hotel_booking_page.number_of_guests')}
                    type="number"
                    fullWidth
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    inputProps={{ min: 1, max: room_type?.max_guests || 1 }} // Max guests by room type
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    label={t('hotel_booking_page.notes_label')}
                    multiline
                    rows={3}
                    fullWidth
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              <strong>{t('hotel_booking_page.booking_summary')}:</strong>
            </Typography>
            <Typography>
              {t('hotel_booking_page.price_per_night_summary')}: {room_type?.price_per_night || 'N/A'} ₸
            </Typography>
            <Typography>{t('hotel_booking_page.nights')}: {nights || 0}</Typography>
            <Typography>
              <strong>{t('hotel_booking_page.total_price')}: {totalPrice || 0} ₸</strong>
            </Typography>

            <Box mt={3} display="flex" gap={2}>
              <Button
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#007bff' }}
                  onClick={handleSubmit}
              >
                {t('hotel_booking_page.right_now')}
              </Button>

              <Button variant="outlined" fullWidth color="inherit">
                {t('hotel_booking_page.cencel')}
              </Button>
            </Box>
          </Paper>
        </Box>
        <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={() => setAlert({ ...alert, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
              onClose={() => setAlert({ ...alert, open: false })}
              severity={alert.severity}
              sx={{ width: '100%' }}
              variant="filled"
          >
            {alert.message}
          </Alert>
        </Snackbar>

        {/* <Footer /> */}
      </>
  );
};

export default HotelBooking;