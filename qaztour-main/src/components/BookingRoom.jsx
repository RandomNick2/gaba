import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Container,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Header from './Header';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';


const BookingRoom = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });
  const { t, i18n } = useTranslation();

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!bookingId) {
      showAlert('error', t('booking_room.error_booking_id_not_found'));
      return;
    }

    if (!token) {
      showAlert('warning', t('booking_room.user_not_authorized'));
      return;
    }

    axios
        .get(`http://127.0.0.1:8000/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.booking) {
            setBooking(response.data.booking);
          } else {
            showAlert('error', t('booking_room.booking_details_not_found'));
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Қате шықты:', error);
          showAlert('error', error.message || t('booking_room.failed_to_fetch_booking'));
          setLoading(false);
        });
  }, [bookingId, t, i18n.language]);

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

  if (!booking) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>{t('booking_room.booking_details_not_found')}</Typography>;
  }

  const {
    hotel,
    room_type,
    check_in_date,
    check_out_date,
    guests_count,
    total_price,
    notes,
    status,
  } = booking;

  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  const hotelName = hotel?.name || t('booking_room.no_name');
  const hotelAddress = hotel?.[`address_${effectiveLang}`] || hotel?.address_kz || hotel?.address_en || t('booking_room.unknown_address');
  const hotelDescription = hotel?.[`description_${effectiveLang}`] || hotel?.description_kz || hotel?.description_en || t('booking_room.no_description');
  const hotelCity = hotel?.city?.name || hotel?.city_id || t('booking_room.unknown_city');
  const hotelCountry = hotel?.country || t('booking_room.unknown_country');

  const roomTypeName = room_type?.[`name_${effectiveLang}`] || room_type?.name_kz || room_type?.name_en || t('booking_room.no_name_room');
  const roomTypeDescription = room_type?.[`description_${effectiveLang}`] || room_type?.description_kz || room_type?.description_en || t('booking_room.no_description_room');

  const handleCancelBooking = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      showAlert('warning', t('booking_room.user_not_authorized'));
      return;
    }

    axios
        .post(
            `http://127.0.0.1:8000/api/bookings/${bookingId}/cancel`,
            { status: 'cancelled' },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        )
        .then((response) => {
          showAlert('success', t('booking_room.booking_cancelled_success'));
          setBooking((prevBooking) => ({
            ...prevBooking,
            status: 'cancelled',
          }));

          navigate('/hotels/');
        })
        .catch((error) => {
          console.error('Қате шықты:', error);
          showAlert('error', error.message || t('booking_room.error_cancelling_booking'));
        });
  };

  const handlePayPalApprove = async (data, actions) => {
    try {
      showAlert('info', t('booking_room.processing_payment')); // ✅ Жаңа хабарлама: Төлем өңделуде
      const details = await actions.order.capture();
      console.log('PayPal capture details:', details); // ✅ PayPal-дан келген толық деректерді тексеру

      const token = localStorage.getItem('authToken');
      if (!token) {
        showAlert('warning', t('booking_room.user_not_authorized'));
        return;
      }

      console.log('Sending payment success to backend:', { // ✅ Бэкэндке жіберілетін деректерді тексеру
        paypal_order_id: data.orderID,
        payer_id: data.payerID,
        payment_details: details,
      });

      const response = await axios.post(
          `http://127.0.0.1:8000/api/bookings/${bookingId}/payment/success`,
          {
            paypal_order_id: data.orderID,
            payer_id: data.payerID,
            payment_details: details,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );

      console.log('Backend response after payment success:', response.data); // ✅ Бэкэнд жауабын тексеру

      if (response.data.success) {
        showAlert('success', t('booking_room.payment_success_message', { name: details.payer.name.given_name }));
        setBooking(prevBooking => ({ ...prevBooking, status: 'confirmed', payment_status: 'paid' }));
        // navigate(`/booking-room/${bookingId}`); // Қажет болса
      } else {
        showAlert('error', response.data.message || t('booking_room.payment_processing_error'));
      }

    } catch (error) {
      console.error('PayPal Approve Error:', error);
      // alert('Төлем кезінде қате шықты, қайтадан көріңізші.'); // Бұрынғы alert орнына showAlert қолданамыз
      showAlert('error', error.response?.data?.message || t('booking_room.payment_error_message'));
    }
  };


  return (
      <>
        <Header />
        <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                fontWeight="bold"
            >
              {t('booking_room.booking_details')}
            </Typography>

            {/* Қонақүй ақпараты */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('booking_room.hotel_information')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                      component="img"
                      src={`http://localhost:8000/storage/${hotel?.image}`}
                      alt={hotelName}
                      sx={{
                        width: '100%',
                        height: 250,
                        borderRadius: 2,
                        objectFit: 'cover',
                      }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="bold">{hotelName}</Typography>
                  <Typography variant="body1" gutterBottom>
                    {hotelDescription}
                  </Typography>
                  <Typography variant="body2">
                    {hotelAddress}, {hotelCity}, {hotelCountry}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.stars')}: {hotel?.stars || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.price_per_night')}: {hotel?.price_per_night || 'N/A'} KZT
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Бөлме түрі */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('booking_room.room_type_heading')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                      component="img"
                      src={`http://localhost:8000/storage/${room_type?.image}`}
                      alt={roomTypeName}
                      sx={{
                        width: '100%',
                        height: 250,
                        borderRadius: 2,
                        objectFit: 'cover',
                      }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="bold">{roomTypeName}</Typography>
                  <Typography variant="body1" gutterBottom>
                    {roomTypeDescription}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_detail.max_guests')}: {room_type?.max_guests || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_detail.available_rooms')}: {room_type?.available_rooms || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.price_per_night')}: {room_type?.price_per_night || 'N/A'} KZT
                  </Typography>
                  <Typography variant="body2">
                    {t('booking_room.breakfast')}: {room_type?.has_breakfast ? t('booking_room.yes') : t('booking_room.no')}
                  </Typography>
                  <Typography variant="body2">
                    {t('booking_room.wifi')}: {room_type?.has_wifi ? t('booking_room.yes') : t('booking_room.no')}
                  </Typography>
                  <Typography variant="body2">
                    {t('booking_room.tv')}: {room_type?.has_tv ? t('booking_room.yes') : t('booking_room.no')}
                  </Typography>
                  <Typography variant="body2">
                    {t('booking_room.air_conditioning')}: {room_type?.has_air_conditioning ? t('booking_room.yes') : t('booking_room.no')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Брондау детализациясы */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('booking_room.booking_details_heading')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    {t('hotel_booking_page.check_in_date')}: {new Date(check_in_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.check_out_date')}: {new Date(check_out_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.guests_count')}: {guests_count}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.notes_label')}: {notes || t('booking_room.none')}
                  </Typography>
                  <Typography variant="body2">
                    {t('hotel_booking_page.status')}: {t(`booking_room.status_${status}`)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {t('hotel_booking_page.total_price')}: {total_price} USD
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Төлеу батырмасы */}
            {status === 'pending' && (
                <Box mt={3} display="flex" gap={2}>
                  <Button
                      variant="contained"
                      color="error"
                      size="large"
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
                      onClick={handleCancelBooking}
                  >
                    {t('hotel_booking_page.cencel')}
                  </Button>

                  <Box sx={{ flexGrow: 1 }}>
                    <PayPalButtons
                        style={{ layout: 'horizontal' }}
                        // createOrder функциясы API-ға сұрау жібере алады
                        createOrder={(data, actions) => {
                          // Бұл жерде сіздің бэкэнд PayPal заказын құруы керек
                          // Немесе оны PayPal-дың өз API-ы арқылы құра аласыз
                          // Қазіргі API.php файлын ескерсек, бэкэнд арқылы құру дұрыс
                          // Бэкэнд PayPal API-ына create order сұрауын жібереді
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD", // PayPalScriptProvider-дағы валютаға сәйкес
                                  value: total_price.toString(),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={handlePayPalApprove}
                        onError={(err) => {
                          console.error('PayPal төлем қатесі:', err);
                          showAlert('error', t('booking_room.payment_error_message'));
                        }}
                    />
                  </Box>
                </Box>
            )}
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

        <Footer />
      </>
  );
};

export default BookingRoom;