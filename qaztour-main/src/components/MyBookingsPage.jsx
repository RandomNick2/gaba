import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Divider,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GetAppIcon from '@mui/icons-material/GetApp'; // Жүктеу иконкасы

// Header және Footer компоненттері, егер бар болса
// import Header from './Header';
// import Footer from './Footer';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchMyBookings = async () => {
            setLoading(true);
            setError(null);

            if (!userId || !token) {
                setError(t('my_bookings.auth_required'));
                setLoading(false);
                // navigate('/auth'); // Авторизациядан өтпесе, логинге бағыттау
                return;
            }

            try {
                // 1. Тур броньдауларын жүктеу
                const tourBookingsResponse = await axios.get(`http://127.0.0.1:8000/api/bookings_tours/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedTourBookings = tourBookingsResponse.data?.bookings || [];
                console.log('Fetched Tour Bookings:', fetchedTourBookings);

                // 2. Қонақүй броньдауларын жүктеу
                // Ескерту: сізде bookings/user/{userId} немесе bookings/user деген маршрут болуы керек
                const hotelBookingsResponse = await axios.get(`http://127.0.0.1:8000/api/bookings/user/${userId}`, { // userId қажет болса
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedHotelBookings = hotelBookingsResponse.data?.bookings || [];
                console.log('Fetched Hotel Bookings:', fetchedHotelBookings);

                // 3. Екі тізімді біріктіру және броньдау түрін белгілеу
                const combinedBookings = [
                    ...fetchedTourBookings.map(b => ({ ...b, type: 'tour' })),
                    ...fetchedHotelBookings.map(b => ({ ...b, type: 'hotel' })),
                ];

                // Күні бойынша сұрыптау (жаңа броньдар бірінші)
                combinedBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setBookings(combinedBookings);

            } catch (err) {
                console.error('My Bookings Page Error:', err.response ? err.response.data : err.message);
                setError(t('my_bookings.failed_to_load_bookings'));
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, [userId, token, t, navigate]);

    // API-да name_kk, description_kk жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
    const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

    const getBookingTitle = (booking) => {
        if (booking.type === 'tour') {
            return booking.tour?.[`name_${effectiveLang}`] || booking.tour?.name_kz || booking.tour?.name_en || t('my_bookings.no_tour_name');
        } else if (booking.type === 'hotel') {
            return booking.hotel?.name || t('my_bookings.no_hotel_name');
        }
        return t('my_bookings.unknown_booking_type');
    };

    const getBookingLocation = (booking) => {
        if (booking.type === 'tour') {
            return booking.tour?.location?.[`name_${effectiveLang}`] || booking.tour?.location?.name_kz || booking.tour?.location?.name_en || t('my_bookings.unknown_location');
        } else if (booking.type === 'hotel') {
            return booking.hotel?.address_kz || booking.hotel?.address_en || t('my_bookings.unknown_address');
        }
        return '';
    };

    const getBookingDateRange = (booking) => {
        if (booking.type === 'tour') {
            return new Date(booking.booking_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US');
        } else if (booking.type === 'hotel') {
            const checkIn = new Date(booking.check_in_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US');
            const checkOut = new Date(booking.check_out_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US');
            return `${checkIn} - ${checkOut}`;
        }
        return '';
    };

    const navigateToDetail = (booking) => {
        if (booking.type === 'tour') {
            navigate(`/booking-tour/${booking.id}`);
        } else if (booking.type === 'hotel') {
            navigate(`/booking-room/${booking.id}`);
        }
    };

    // ✅ Чекті жүктеу функциясы (болашақ үшін)
    const handleDownloadReceipt = (booking) => {
        alert(t('my_bookings.downloading_receipt', { type: booking.type, id: booking.id }));
        // Чекті генерациялау логикасы осында орналасады
        // Бұл frontend-те PDF генерациялау немесе backend-тен PDF алу болуы мүмкін.
        // Осы жерде AVENTRA авторлық чегін жасау логикасы қосылады.
        console.log(`Downloading receipt for ${booking.type} booking ID: ${booking.id}`);
        // Қосымша: PDF генерациялау және жүктеу
        // (html2canvas + jspdf немесе backend API шақыру)
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
            <Container sx={{ paddingY: 14 }}>
                <Typography variant="h6" color="error" textAlign="center">
                    {t('my_bookings.error')}: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 14 }}>
            {/* <Header /> */}
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" mb={4}>
                {t('my_bookings.my_bookings_title')}
            </Typography>

            {bookings.length > 0 ? (
                <Grid container spacing={3}>
                    {bookings.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} key={`${booking.type}-${booking.id}`}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': { transform: 'translateY(-5px)' },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" fontWeight="bold">
                                        {getBookingTitle(booking)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {getBookingLocation(booking)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <CalendarTodayIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {t('my_bookings.date')}: {getBookingDateRange(booking)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <AttachMoneyIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {t('my_bookings.total_price')}: {booking.total_price} KZT
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {t('my_bookings.guests')}: {booking.guests_count || booking.seats}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {t('my_bookings.status')}: {t(`booking_room.status_${booking.status}`)} {/* BookingRoom/Detail статустарын қайта қолданамыз */}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Button variant="outlined" size="small" onClick={() => navigateToDetail(booking)}>
                                            {t('my_bookings.view_details')}
                                        </Button>
                                        {booking.status === 'confirmed' && ( // Тек расталған броньдар үшін чекті жүктеу
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<GetAppIcon />}
                                                onClick={() => handleDownloadReceipt(booking)}
                                            >
                                                {t('my_bookings.download_receipt')}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
                    {t('my_bookings.no_bookings_found')}
                </Typography>
            )}
            {/* <Footer /> */}
        </Container>
    );
};

export default MyBookingsPage;