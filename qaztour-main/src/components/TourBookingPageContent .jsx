import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    Container,
    Snackbar,
    Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Header және Footer компоненттері, егер олар сіздің жобаңызда бар болса
// import Header from './Header';
// import Footer from './Footer';

const TourBookingPage = () => { // Компонент атауы TourBookingPage болып өзгертілді
    const { tourId } = useParams();
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { t, i18n } = useTranslation();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    console.log('Current userId from localStorage:', userId); // ✅ Осыны тексеріңіз
    console.log('Current token from localStorage:', token);

    const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

    const showAlert = (severity, message) => {
        setAlert({ open: true, severity, message });
    };

    useEffect(() => {
        if (!userId) {
            // showAlert('warning', t('tour_booking_page.user_id_not_found'));
            // navigate('/login');
            // return;
        }

        if (!token) {
            showAlert('warning', t('tour_booking_page.user_not_authorized_api'));
            setLoading(false);
            return;
        }

        const fetchTourData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/tours/${tourId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('API Response for Tour Booking:', response.data);

                // ✅ ӨЗГЕРІС БҰЛ ЖЕРДЕ: API жауабындағы tour объектісін тікелей аламыз
                const fetchedTour = response.data?.tour;

                if (fetchedTour) {
                    setTour(fetchedTour);
                    if (fetchedTour.date) {
                        setBookingDate(fetchedTour.date.split(' ')[0]);
                    }
                } else {
                    showAlert('error', t('tour_booking_page.tour_data_not_found'));
                }
                setLoading(false);
            } catch (error) {
                console.error('Қате шықты:', error.response ? error.response.data : error.message);
                showAlert('error', error.response?.data?.message || t('tour_booking_page.failed_to_load_tour_data'));
                setLoading(false);
            }
        };

        fetchTourData();
    }, [tourId, token, t, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tour) return;
        setSubmitting(true);

        if (!bookingDate) {
            showAlert('error', t('tour_booking_page.please_select_date'));
            setSubmitting(false);
            return;
        }
        if (guests <= 0) {
            showAlert('error', t('tour_booking_page.invalid_guests_count'));
            setSubmitting(false);
            return;
        }
        if (tour.volume && guests > tour.volume) {
            showAlert('error', t('tour_booking_page.guests_exceed_limit', { limit: tour.volume }));
            setSubmitting(false);
            return;
        }

        const totalPrice = tour.price * guests;

        const payload = {
            user_id: userId,
            tour_id: tour.id,
            booking_date: bookingDate,
            guests_count: guests,
            notes,
            total_price: totalPrice,
            status: 'pending',
        };

        if (!payload.user_id) {
            showAlert('warning', t('tour_booking_page.user_not_authorized_booking'));
            setSubmitting(false);
            return;
        }

        try {
            await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/bookings_tours',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const bookingId = response.data?.booking?.id;

            showAlert('success', t('tour_booking_page.booking_successful'));
            if (bookingId) {
                navigate(`/booking-tour/${bookingId}`);
            } else {
                console.error('Қате: bookingId жоқ');
                showAlert('error', t('tour_booking_page.error_booking_id_missing'));
            }
        } catch (error) {
            console.error('Қате:', error.response?.data || error.message);
            showAlert('error', error.response?.data?.message || t('tour_booking_page.error_occurred_check_data'));
        } finally {
            setSubmitting(false);
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

    if (error) {
        return (
            <Container sx={{ mt: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!tour) {
        return (
            <Typography sx={{ mt: 12, textAlign: 'center' }}>
                {t('tour_booking_page.tour_not_found_info')}
            </Typography>
        );
    }

    const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

    const tourName = tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('tour_booking_page.no_name');
    const tourDescription = tour[`description_${effectiveLang}`] || tour.description_kz || tour.description_en || t('tour_booking_page.no_description');
    const tourLocationName = tour.location?.[`name_${effectiveLang}`] || tour.location?.name_kz || tour.location?.name_en || t('tour_booking_page.unknown_location');

    const totalPrice = tour.price * guests;

    return (
        <>
            {/* <Header /> */}
            <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        textAlign="center"
                        fontWeight="bold"
                    >
                        {t('tour_booking_page.book_tour_title')}
                    </Typography>

                    <Box mb={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            {t('tour_booking_page.tour_information')}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src={`http://localhost:8000/storage/${tour.image}`}
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
                                    {t('tour_booking_page.price_per_person')}: {tour.price || 'N/A'} KZT
                                </Typography>
                                <Typography variant="body2">
                                    {t('tour_booking_page.max_volume')}: {tour.volume || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            {t('tour_booking_page.booking_form_heading')}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={t('tour_booking_page.booking_date')}
                                        type="date"
                                        fullWidth
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={t('tour_booking_page.number_of_guests')}
                                        type="number"
                                        fullWidth
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                                        inputProps={{ min: 1, max: tour.volume || 100 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label={t('tour_booking_page.notes_label')}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {t('tour_booking_page.total_price')}: {totalPrice || 0} KZT
                                </Typography>
                            </Box>

                            <Box mt={3} display="flex" gap={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ backgroundColor: '#007bff' }}
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? t('tour_booking_page.submitting') : t('tour_booking_page.book_now_button')}
                                </Button>

                                <Button variant="outlined" fullWidth color="inherit">
                                    {t('hotel_booking_page.cencel')}
                                </Button>
                            </Box>
                        </form>
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

export default TourBookingPage;