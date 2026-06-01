import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импорты

// ✅ react-leaflet компоненттерін импорттау
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Бейнелерді көрсету үшін YouTube/Vimeo сілтемелерін өңдейтін көмекші функция
const getYouTubeEmbedUrl = (url) => {
  const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/g;
  const match = regExp.exec(url);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null; // ✅ Дұрыс YouTube embed URL
};

const getVimeoEmbedUrl = (url) => {
  const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(?:channels\/|groups\/[^\/]*\/videos\/|video\/|)([\d]+)(?:\S+)?/g;
  const match = regExp.exec(url);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
};

// getImageUrl функциясы (бұрынғыдай, сурет жолдарын BASE_URL-мен біріктіреді)
const BASE_URL = 'http://127.0.0.1:8000/storage/';
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/600x400?text=Event+Image';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${encodeURIComponent(imagePath)}`;
};

const SingleEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation(); // ✅ i18n объектісін аламыз

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
            `https://cloud-aventra-kz.onrender.com/api/events/${id}`
        );
        console.log('API Response for Single Event:', response.data); // Бұл жолы толық жауапты қараңыз

        // ✅ API жауабының құрылымын тексеру: response.data.data
        const fetchedEvent = response.data;
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          setError(t('event_detail.event_not_found_message')); // Локализация
        }
      } catch (err) {
        console.error('Оқиғаны жүктеу кезінде қате кетті:', err);
        setError(err.message || t('event_detail.failed_to_load_event')); // Локализация
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]); // ✅ 't' функциясын тәуелділікке қосу

  const handleGoBack = () => {
    navigate(-1);
  };

  // API-да title_kk, description_kk, location_name_kk, address_kk жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  // --- ШАРТТЫ РЕНДЕРЛЕУ (CONDITIONAL RENDERING) ---
  if (loading) {
    return (
        <Container
            sx={{
              mt: 14,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
        >
          <CircularProgress />
          <Typography ml={2}>{t('event_detail.loading_event')}...</Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container sx={{ mt: 14, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            {t('event_detail.error')}: {error}
          </Typography>
        </Container>
    );
  }

  if (!event) {
    return (
        <Container sx={{ mt: 14, textAlign: 'center' }}>
          <Typography variant="h6" color="warning">
            {t('event_detail.event_not_found')}
          </Typography>
        </Container>
    );
  }

  // ✅ Іс-шара деректерін локализациялау
  const eventTitle =
      event[`title_${effectiveLang}`] || event.title_kz || event.title_en || t('event_detail.no_title');
  const eventDescription =
      event[`description_${effectiveLang}`] || event.description_kz || event.description_en || t('event_detail.no_description');
  const eventLocationName =
      event[`location_name_${effectiveLang}`] || event.location_name_kz || event.location_name_en || t('event_detail.unknown_location');
  const eventAddress =
      event[`address_${effectiveLang}`] || event.address_kz || event.address_en || t('event_detail.no_address');
  const localizedEventType = event.event_type ?
      (event.event_type[`name_${effectiveLang}`] ||
          event.event_type.name_kz ||
          event.event_type.name_en ||
          t('event_detail.unknown_type')) : t('event_detail.unknown_type');
  const eventOrganizer = event.organizer || t('event_detail.unknown_organizer');
  const eventPriceInfo = event.price_info || t('event_detail.free');


  const youtubeEmbedUrl = event.video_url
      ? getYouTubeEmbedUrl(event.video_url)
      : null;
  const vimeoEmbedUrl = event.video_url
      ? getVimeoEmbedUrl(event.video_url)
      : null;

  return (
      <Container sx={{ py: 14 }}>
        <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
          <ArrowBackIosIcon />
        </IconButton>
        <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
          <CardMedia
              component="img"
              alt={eventTitle}
              height="400"
              image={getImageUrl(event.image)}
              sx={{ objectFit: 'cover', borderRadius: 'inherit' }}
          />
          <CardContent>
            <Typography
                gutterBottom
                variant="h4"
                component="h1"
                fontWeight="bold"
            >
              {eventTitle}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {localizedEventType} | {eventOrganizer}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('event_detail.description_heading')}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {eventDescription}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t('event_detail.details_heading')}
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon>
                  <CalendarTodayIcon color="action" />
                </ListItemIcon>
                <ListItemText
                    primary={t('event_detail.date_time')}
                    secondary={`${new Date(event.start_date).toLocaleString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')} - ${ /* ✅ Датаны локализациялау */
                        event.end_date
                            ? new Date(event.end_date).toLocaleString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US') /* ✅ Датаны локализациялау */
                            : t('event_detail.ongoing') /* ✅ Локализация */
                    }`}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <LocationOnIcon color="action" />
                </ListItemIcon>
                <ListItemText
                    primary={t('event_detail.location_heading')}
                    secondary={`${eventLocationName} (${eventAddress})`}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <AttachMoneyIcon color="action" />
                </ListItemIcon>
                <ListItemText
                    primary={t('event_detail.price_heading')}
                    secondary={eventPriceInfo}
                />
              </ListItem>
              {event.phone && (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <PhoneIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary={t('event_detail.phone')} secondary={event.phone} />
                  </ListItem>
              )}
              {event.email && (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <EmailIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary={t('event_detail.email')} secondary={event.email} />
                  </ListItem>
              )}
              {event.website && (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <PublicIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                        primary={t('event_detail.website_heading')}
                        secondary={
                          <Link href={event.website} target="_blank" rel="noopener noreferrer">
                            {event.website}
                          </Link>
                        }
                    />
                  </ListItem>
              )}
            </List>


            {(youtubeEmbedUrl || vimeoEmbedUrl) && (
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('event_detail.video_heading')}
                  </Typography>
                  <Box sx={{ position: 'relative', pt: '56.25%', mb: 2 }}>
                    {' '}
                    {/* 16:9 қатынасы үшін */}
                    {youtubeEmbedUrl && (
                        <iframe
                            src={youtubeEmbedUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderRadius: 8,
                            }}
                            title={eventTitle}
                        ></iframe>
                    )}
                    {vimeoEmbedUrl && (
                        <iframe
                            src={vimeoEmbedUrl}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderRadius: 8,
                            }}
                            title={eventTitle}
                        ></iframe>
                    )}
                  </Box>
                </Box>
            )}

            {/* Галерея (қосымша суреттер) */}
            {event.gallery_images && event.gallery_images.length > 0 && (
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('event_detail.gallery_heading')}
                  </Typography>
                  <Grid container spacing={2}>
                    {event.gallery_images.map((imgSrc, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <CardMedia
                              component="img"
                              image={getImageUrl(imgSrc)}
                              alt={`${t('event_detail.gallery_image')} ${index + 1}`}
                              sx={{
                                borderRadius: 2,
                                height: 180,
                                objectFit: 'cover',
                              }}
                          />
                        </Grid>
                    ))}
                  </Grid>
                </Box>
            )}

            {/* Карта (егер координаттар болса) */}
            {event.latitude && event.longitude && (
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('event_detail.location_on_map_heading')}
                  </Typography>
                  <Box sx={{ height: 350, borderRadius: 2, overflow: 'hidden' }}>
                    <MapContainer
                        center={[
                          parseFloat(event.latitude),
                          parseFloat(event.longitude),
                        ]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        key={event.id}
                    >
                      <TileLayer
                          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                          position={[
                            parseFloat(event.latitude),
                            parseFloat(event.longitude),
                          ]}
                      >
                        <Popup>{eventTitle}</Popup>
                      </Marker>
                    </MapContainer>
                  </Box>
                </Box>
            )}
          </CardContent>
        </Card>
      </Container>
  );
};

export default SingleEventPage;