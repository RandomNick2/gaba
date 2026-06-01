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
    Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Header from './Header'; // Егер бар болса
import Footer from './Footer'; // Егер бар болса
import { useTranslation } from 'react-i18next';

const BookingTourDetail = () => {
    const { bookingId } = useParams(); // URL параметрінен bookingId алу
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });
    const { t, i18n } = useTranslation();

    // Хабарламаларды көрсету функциясы
    const showAlert = (severity, message) => {
        setAlert({ open: true, severity, message });
    };

    useEffect(() => {
        console.log('--- BookingTourDetail useEffect started ---'); // ✅ Дебаг
        console.log('Booking ID from useParams:', bookingId); // ✅ Дебаг
        const token = localStorage.getItem('authToken');
        console.log('Auth Token from localStorage:', token);

        if (!bookingId) {
            showAlert('error', t('booking_tour_detail.error_booking_id_not_found'));
            setLoading(false);
            console.log('Booking ID is null/undefined. Stopping fetch.'); // ✅ Дебаг
            return;
        }

        if (!token) {
            showAlert('warning', t('booking_tour_detail.user_not_authorized'));
            setLoading(false);
            console.log('Auth Token is null/undefined. Stopping fetch.'); // ✅ Дебаг
            return;
        }
        console.log(`Attempting to fetch booking data for ID: ${bookingId} with token: ${token}`); // ✅ Дебаг

        // API-дан тур брондау мәліметтерін жүктеу
        axios
            .get(`http://127.0.0.1:8000/api/bookings_tours/${bookingId}`, { // ✅ bookings_tours маршруты
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // API жауабындағы құрылымға сәйкес booking дерегін алу
                // response.data.booking деп болжаймыз, себебі BookingController@show осылай қайтарады
                if (response.data.booking) {
                    setBooking(response.data.booking);
                } else {
                    showAlert('error', t('booking_tour_detail.booking_details_not_found'));
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Қате шықты:', error);
                showAlert('error', error.message || t('booking_tour_detail.failed_to_fetch_booking'));
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
        return <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>{t('booking_tour_detail.booking_details_not_found')}</Typography>;
    }

    const {
        tour, // Тур объектісі
        booking_date, // Брондау күні
        guests_count,
        total_price,
        notes,
        status,
    } = booking;

    // API-да name_kk, description_kk сияқты кілттер жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
    const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

    // Тур деректерін локализациялау
    const tourName = tour?.[`name_${effectiveLang}`] || tour?.name_kz || tour?.name_en || t('booking_tour_detail.no_name');
    const tourDescription = tour?.[`description_${effectiveLang}`] || tour?.description_kz || tour?.description_en || t('booking_tour_detail.no_description');
    const tourLocationName = tour?.location?.[`name_${effectiveLang}`] || tour?.location?.name_kz || tour?.location?.name_en || t('booking_tour_detail.unknown_location');

    const handleCancelBooking = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            showAlert('warning', t('booking_tour_detail.user_not_authorized'));
            return;
        }

        try {
            // ✅bookings_tours маршрутын қолданамыз
            await axios.delete(`http://127.0.0.1:8000/api/bookings_tours/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showAlert('success', t('booking_tour_detail.booking_cancelled_success'));
            setBooking((prevBooking) => ({
                ...prevBooking,
                status: 'cancelled',
            }));
            navigate('/tour_bookings'); // Тур брондаулары тізіміне бағыттау
        } catch (error) {
            console.error('Қате шықты:', error);
            showAlert('error', error.message || t('booking_tour_detail.error_cancelling_booking'));
        }
    };

    // ✅ PayPal төлемді өңдегеннен кейін бэкэндке жіберу логикасы
    const handlePayPalApprove = async (data, actions) => {
        try {
            showAlert('info', t('booking_tour_detail.processing_payment'));
            const details = await actions.order.capture(); // PayPal төлемін растау
            console.log('PayPal capture details:', details);

            const token = localStorage.getItem('authToken');
            if (!token) {
                showAlert('warning', t('booking_tour_detail.user_not_authorized'));
                return;
            }

            console.log('Sending payment success to backend:', {
                paypal_order_id: data.orderID,
                payer_id: data.payerID,
                payment_details: details,
            });

            // ✅ bookings_tours төлем маршрутын қолданамыз
            const response = await axios.post(
                `http://127.0.0.1:8000/api/bookings_tours/${bookingId}/payment/success`, // Жаңа маршрут
                {
                    paypal_order_id: data.orderID,
                    payer_id: data.payerID,
                    payment_details: details, // Толық мәліметтерді де жіберуге болады
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Backend response after payment success:', response.data);

            if (response.data.success) {
                showAlert('success', t('booking_tour_detail.payment_success_message', { name: details.payer.name.given_name }));
                setBooking(prevBooking => ({ ...prevBooking, status: 'confirmed', payment_status: 'paid' }));
            } else {
                showAlert('error', response.data.message || t('booking_tour_detail.payment_processing_error'));
            }

        } catch (error) {
            console.error('PayPal Approve Error:', error);
            showAlert('error', error.response?.data?.message || t('booking_tour_detail.payment_error_message'));
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
                        {t('booking_tour_detail.booking_details')}
                    </Typography>

                    {/* Тур ақпараты */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            {t('tour_booking_page.tour_information')}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src={`http://localhost:8000/storage/${tour?.image}`} // Optional chaining
                                    alt={tourName}
                                    sx={{
                                        width: '100%',
                                        height: 250,
                                        borderRadius: 2,
                                        objectFit: 'cover',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold">{tourName}</Typography>
                                <Typography variant="body1" gutterBottom>
                                    {tourDescription}
                                </Typography>
                                <Typography variant="body2">
                                    {t('tour_booking_page.location')}: {tourLocationName}
                                </Typography>
                                <Typography variant="body2">
                                    {t('tour_booking_page.price_per_person')}: {tour?.price || 'N/A'} KZT
                                </Typography>
                                <Typography variant="body2">
                                    {t('tour_booking_page.max_volume')}: {tour?.volume || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Брондау детализациясы */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            {t('hotel_booking_page.booking_details_heading')}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                    {t('tour_booking_page.booking_date')}: {new Date(booking_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}
                                </Typography>
                                <Typography variant="body2">
                                    {t('hotel_booking_page.guests_count')}: {guests_count}
                                </Typography>
                                <Typography variant="body2">
                                    {t('tour_booking_page.notes_label')}: {notes || t('create_post_page.none')}
                                </Typography>
                                <Typography variant="body2">
                                    {t('hotel_booking_page.status')}: {t(`hotel_booking_page.status_${status}`)} {/* Статусты локализациялау */}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {t('tour_booking_page.total_price')}: {total_price} KZT
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
                                    createOrder={(data, actions) => {
                                        const exchangeRate = 450; // Айырбастау курсы (USD = 450 KZT)
                                        const usdPrice = (total_price / exchangeRate).toFixed(2);

                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: "USD",
                                                        value: usdPrice,
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={handlePayPalApprove}
                                    onError={(err) => {
                                        console.error('PayPal төлем қатесі:', err);
                                        showAlert('error', t('booking_tour_detail.payment_error_message'));
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

export default BookingTourDetail;