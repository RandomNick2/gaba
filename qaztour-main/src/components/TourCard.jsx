import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Button as MuiButton, Card as MuiCard, CardContent as MuiCardContent, styled, useTheme, CircularProgress,
} from '@mui/material';
import Grid from '@mui/joy/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import TypographyJoy from '@mui/joy/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импортталған

// --- Styled Components (бұрынғыдай қалады) ---
const SectionWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e0ffff 100%)',
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(10),
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(14),
    },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(4),
    },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '3.5rem',
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1),
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    [theme.breakpoints.down('md')]: {
        fontSize: '2.5rem',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
    },
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    color: theme.palette.text.secondary,
    maxWidth: 700,
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
    },
}));

const StyledTourCard = styled(Card)(({ theme }) => ({
    border: 'none',
    boxShadow: theme.shadows[15],
    borderRadius: theme.spacing(3),
    maxWidth: 400,
    mx: 'auto',
    p: theme.spacing(2.5),
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
    '&:hover': {
        transform: 'scale(1.08) rotate(1deg)',
        boxShadow: theme.shadows[20],
    },
    position: 'relative',
    cursor: 'pointer',
}));

const TourImageWrapper = styled(AspectRatio)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    overflow: 'hidden',
}));

const TourTitle = styled(TypographyJoy)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '1.3rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
    },
}));

const TourDateLocation = styled(TypographyJoy)(({ theme }) => ({
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1.5),
}));

const TourPrice = styled(TypographyJoy)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.warning.dark,
}));

const ViewButton = styled(Button)(({ theme }) => ({
    ml: 'auto',
    alignSelf: 'center',
    fontWeight: 600,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(1.5),
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const FavoriteToggleButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    color: theme.palette.error.main,
    borderRadius: '50%',
    zIndex: 1,
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transform: 'scale(1.05)',
    },
}));

const WaveSeparator = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '120px',
    marginTop: '-1px',
    zIndex: 1,
    '& svg path': {
        stroke: 'none',
        fill: 'url(#waveGradient)',
    },
}));

// --- Main Component ---
export default function ToursCollection() {
    const [featuredTours, setFeaturedTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        console.log('TOUR COLLECTION: useEffect triggered. Current language:', i18n.language);

        const fetchData = async () => { // ✅ fetchTours орнына fetchData деп атадық
            setLoading(true);
            setError(null);
            try {
                // 1. Турларды жүктеу
                const toursResponse = await axios.get('http://127.0.0.1:8000/api/tours_featured');
                const fetchedTours = toursResponse.data.data || [];

                // 2. Локацияларды жүктеу
                const locationsResponse = await axios.get('http://127.0.0.1:8000/api/locations');
                // ✅ API жауабының құрылымын тексеріңіз. Егер locations.data.data болса
                const fetchedLocations = locationsResponse.data.data || locationsResponse.data || [];
                setLocations(fetchedLocations); // ✅ Локацияларды күйге сақтау

                setFeaturedTours(fetchedTours);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data for ToursCollection:', err);
                setError(err.message || 'Деректерді жүктеу мүмкін болмады.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [i18n.language]);

    const getImageUrl = (imagePath) => {

        if (!imagePath) return 'https://via.placeholder.com/400x250?text=Tour+Image' // Әдепкі сурет

        if (imagePath.startsWith('http')) return imagePath

        return `http://127.0.0.1:8000/storage/${encodeURIComponent(imagePath)}`

    }
    const handleCardClick = (tourId) => { navigate(`/tour/${tourId}`); };

    if (loading) {

        return (

            <SectionWrapper>

                <SectionHeader>

                    <StyledTitle component="h2">✨ {t('tour_card.title')}</StyledTitle>

                    <StyledSubtitle>{t('tour_card.description')}</StyledSubtitle>

                </SectionHeader>

                <Container sx={{ textAlign: 'center', py: 5 }}>

                    <CircularProgress color="primary" />

                    <Typography variant="body1" mt={2}>

                        Турлар жүктелуде...

                    </Typography>

                </Container>
                <WaveSeparator>
                    <svg
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                        style={{ height: '100%', width: '100%' }}
                    >
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop
                                    offset="0%"
                                    style={{ stopColor: '#0093E9', stopOpacity: 1 }}
                                />
                                <stop
                                    offset="100%"
                                    style={{ stopColor: '#80D0C7', stopOpacity: 1 }}
                                />
                            </linearGradient>
                        </defs>
                        <path
                            d="M-2.54,95.23 C222.63,199.84 369.35,37.02 501.97,99.19 L500.00,150.00 L0.00,150.00 Z"
                            style={{ stroke: 'none', fill: 'url(#waveGradient)' }}
                        />
                    </svg>
                </WaveSeparator>

            </SectionWrapper>


        )

    }
    if (error) {

        return (

            <SectionWrapper>

                <SectionHeader>

                    <StyledTitle component="h2">✨ {t('tour_card.title')}</StyledTitle>

                    <StyledSubtitle>{t('tour_card.description')}</StyledSubtitle>

                </SectionHeader>

                <Container sx={{ textAlign: 'center', py: 5 }}>

                    <Typography variant="h6" color="error">

                        Қате: {error}

                    </Typography>

                </Container>
                <WaveSeparator>
                    <svg
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                        style={{ height: '100%', width: '100%' }}
                    >
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop
                                    offset="0%"
                                    style={{ stopColor: '#0093E9', stopOpacity: 1 }}
                                />
                                <stop
                                    offset="100%"
                                    style={{ stopColor: '#80D0C7', stopOpacity: 1 }}
                                />
                            </linearGradient>
                        </defs>
                        <path
                            d="M-2.54,95.23 C222.63,199.84 369.35,37.02 501.97,99.19 L500.00,150.00 L0.00,150.00 Z"
                            style={{ stroke: 'none', fill: 'url(#waveGradient)' }}
                        />
                    </svg>
                </WaveSeparator>

            </SectionWrapper>

        )

    }

    return (
        <SectionWrapper>
            <Container>
                <SectionHeader>
                    <StyledTitle component="h2">✨ {t('tour_card.title')}</StyledTitle>
                    <StyledSubtitle>{t('tour_card.description')}</StyledSubtitle>
                </SectionHeader>

                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flexGrow: 1 }}>
                    {featuredTours.length > 0 ? (
                        featuredTours.map((tour) => {
                            const currentLang = i18n.language; // 'kk' немесе 'en'

                            // ✅ Локализация логикасын дұрыстау
                            const localizedTourName =
                                tour[`name_${currentLang}`] || // Ағымдағы тіл (name_kk немесе name_en)
                                tour.name_kz || // Fallback: қазақша (API-де name_kz бар)
                                tour.name_en || // Fallback: ағылшынша
                                'Белгісіз атау'; // Егер ешқайсысы болмаса

                            const localizedDescription =
                                tour[`description_${currentLang}`] ||
                                tour.description_kz || // Fallback: қазақша
                                tour.description_en || // Fallback: ағылшынша
                                'Сипаттама жоқ';

                            const tourLocation = locations.find(loc => loc.id === tour.location_id);
                            const localizedLocationName = tourLocation ?
                                (tourLocation[`name_${currentLang}`] ||
                                    tourLocation.name_en ||
                                    tourLocation.name_kz ||
                                    '—') : '—';


                            console.log(`TOUR: ID ${tour.id}, Lang: ${currentLang}, Localized name: ${localizedTourName}`);


                            return (
                                <Grid key={tour.id} xs={12} sm={6} md={4}>
                                    <StyledTourCard onClick={() => handleCardClick(tour.id)}>
                                        <FavoriteToggleButton
                                            aria-label={t('tour_card.add_to_favorites')}
                                            variant="plain"
                                            color="neutral"
                                            size="sm"
                                        >
                                            <FavoriteBorderIcon />
                                        </FavoriteToggleButton>
                                        <TourImageWrapper
                                            minHeight="150px"
                                            maxHeight="250px"
                                            ratio="16/9"
                                        >
                                            <img src={getImageUrl(tour.image)} alt={localizedTourName} />
                                        </TourImageWrapper>
                                        <MuiCardContent
                                            orientation="horizontal"
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end',
                                                p: 0,
                                            }}
                                        >
                                            <Box sx={{ mr: 1 }}>
                                                <TourTitle>{localizedTourName}</TourTitle> {/* ✅ Локализацияланған атау */}
                                                <TourDateLocation>
                                                    {new Date(tour.date).toLocaleDateString()} •{' '}
                                                    {localizedLocationName} {/* ✅ Локализацияланған локация */}
                                                </TourDateLocation>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>

                                                <TourPrice>
                                                    ₸{parseFloat(tour.price).toLocaleString('kk-KZ')}
                                                </TourPrice>
                                            </Box>
                                        </MuiCardContent>

                                    </StyledTourCard>
                                </Grid>
                            );
                        })
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" color="text.secondary" textAlign="center">
                                {t('tour_card.no_tours_found_featured')}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>

            {/* Толқынды бөлгіш */}
            <WaveSeparator>
                <svg
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                    style={{ height: '100%', width: '100%' }}
                >
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop
                                offset="0%"
                                style={{ stopColor: '#0093E9', stopOpacity: 1 }}
                            />
                            <stop
                                offset="100%"
                                style={{ stopColor: '#80D0C7', stopOpacity: 1 }}
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M-2.54,95.23 C222.63,199.84 369.35,37.02 501.97,99.19 L500.00,150.00 L0.00,150.00 Z"
                        style={{ stroke: 'none', fill: 'url(#waveGradient)' }}
                    />
                </svg>
            </WaveSeparator>
        </SectionWrapper>
    );
}