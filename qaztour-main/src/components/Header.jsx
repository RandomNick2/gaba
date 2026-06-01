import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  FormControl,
  Select,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useWeather } from './WeatherContext';
import { useTranslation } from 'react-i18next'; // useTranslation импортталған

// --- Styled Components (бұрынғыдай қалады) ---
const DynamicIsland = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1100,
  top: 10,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '15px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(12px)',
  width: '95%',
  maxWidth: '1200px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px 12px',
    gap: '8px',
  },
}));

const MobileMenuContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
}));

// Қалалар массиві (өзгеріссіз қалады)
const cities = [
  { name: 'Алматы', icon: '🌄', lat: 43.238949, lon: 76.889709 },
  { name: 'Астана', icon: '🏙️', lat: 51.1605, lon: 71.4704 },
  { name: 'Шымкент', icon: '🌿', lat: 42.32, lon: 69.595 },
  { name: 'Ақтау', icon: '🌊', lat: 43.652, lon: 51.197 },
  { name: 'Қостанай', icon: '🌾', lat: 53.219, lon: 63.628 },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Мобильді экранды анықтайды
  const [pageTitleColor] = useState('black');
  const [exploreMenuEl, setExploreMenuEl] = useState(null);
  const [cityAnchorEl, setCityAnchorEl] = useState(null);
  const [userMenuEl, setUserMenuEl] = useState(null);
  const [mobileMenuEl, setMobileMenuEl] = useState(null);
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const { t, i18n } = useTranslation();

  const { weather, fetchWeather } = useWeather();
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setExploreMenuEl(event.currentTarget);
  const handleMenuClose = () => setExploreMenuEl(null);

  const handleCityClick = (event) => setCityAnchorEl(event.currentTarget);
  const handleCityClose = () => setCityAnchorEl(null);
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    handleCityClose();
  };

  const handleUserMenuOpen = (event) => setUserMenuEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuEl(null);

  const handleMobileMenuOpen = (event) => setMobileMenuEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuEl(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    handleUserMenuClose();
    navigate('/auth');
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity.lat, selectedCity.lon);
    }
  }, [selectedCity, fetchWeather]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // ✅ Локация атауларын локализациялау логикасы
  const getLocalizedCityName = (city) => {
    const currentLang = i18n.language;
    // API жауабында city объектісінде name_kz/name_en бағандары болса, соларды қолдану
    // Әйтпесе, city.name-ді қолдану
    return city[`name_${currentLang}`] || city.name_en || city.name_kz || city.name;
  };


  return (
      <AppBar
          position="fixed"
          sx={{
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1100,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
      >
        <Container fixed>
          <DynamicIsland initial={{ height: 50 }} animate={{ height: 50 }}>
            {isMobile ? (
                // ✅ Мобильді нұсқа
                <>
                  <IconButton onClick={handleMobileMenuOpen} sx={{ color: 'black' }}>
                    <MenuIcon />
                  </IconButton>
                  <Menu
                      anchorEl={mobileMenuEl}
                      open={Boolean(mobileMenuEl)}
                      onClose={handleMobileMenuClose}
                      PaperProps={{
                        style: {
                          width: '80%',
                          maxWidth: '300px',
                          borderRadius: '12px',
                        },
                      }}
                  >
                    <MobileMenuContainer>
                      {/* Мобильді мәзір элементтері */}
                      <Button
                          fullWidth
                          component={NavLink}
                          to="/"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.home')}
                      </Button>
                      <Button
                          fullWidth
                          component={NavLink}
                          to="/tours"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.tours')}
                      </Button>
                      <Button
                          fullWidth
                          component={NavLink}
                          to="/gallery"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.gallery')}
                      </Button>
                      <MenuItem
                          component={NavLink}
                          to="https://3dmapcentral.asia/kz/#h85/103.0/5.5/108.5"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.3d_tour')}
                      </MenuItem>
                      <Button
                          fullWidth
                          component={NavLink}
                          to="/events"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.events')}
                      </Button>
                      <Button
                          fullWidth
                          component={NavLink}
                          to="/video-travel"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.video_travel')}
                      </Button>
                      <Button
                          fullWidth
                          component={NavLink}
                          to="/blogs"
                          onClick={handleMobileMenuClose}
                          sx={{ color: 'black', justifyContent: 'flex-start' }}
                      >
                        {t('header.blog')}
                      </Button>
                      {/* Мобильдіде пайдаланушы мәзірін де қосу */}
                      {user ? (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <MenuItem
                                component={NavLink}
                                to="/profile"
                                onClick={handleMobileMenuClose}
                                sx={{ color: 'black', justifyContent: 'flex-start' }}
                            >
                              {t('header.profile')}
                            </MenuItem>
                            <MenuItem
                                component={NavLink}
                                to="/settings"
                                onClick={handleMobileMenuClose}
                                sx={{ color: 'black', justifyContent: 'flex-start' }}
                            >
                              {t('header.settings')}
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'black', justifyContent: 'flex-start' }}>
                              {t('header.logout')}
                            </MenuItem>
                          </>
                      ) : (
                          <Button
                              fullWidth
                              onClick={handleLoginClick}
                              sx={{ color: 'black', justifyContent: 'flex-start' }}
                          >
                            {t('header.create_account')}
                          </Button>
                      )}
                      {/* Тіл ауыстыруды да мобильді мәзірге қосу */}
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            value={i18n.language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            disableUnderline
                            sx={{ color: 'black', '& .MuiSelect-icon': { color: 'black' } }}
                        >
                          <MenuItem value="kk">ҚАЗ</MenuItem>
                          <MenuItem value="en">ENG</MenuItem>
                        </Select>
                      </FormControl>
                    </MobileMenuContainer>
                  </Menu>
                </>
            ) : (
                // ✅ Десктоп нұсқасы
                <Button component={NavLink} to="/" sx={{ color: 'black' }}>
                  <Typography variant="h6">Aventra</Typography>
                </Button>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {!isMobile && ( // Десктопта ғана көрінетін элементтер
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Button component={NavLink} to="/" sx={{ color: 'black', fontSize: '14px' }}>
                    {t('header.home')}
                  </Button>
                  <Button component={NavLink} to="/tours" sx={{ color: 'black', fontSize: '14px' }}>
                    {t('header.tours')}
                  </Button>
                  <Button
                      aria-controls="explore-menu"
                      aria-haspopup="true"
                      onMouseEnter={handleMenuOpen}
                      sx={{ color: pageTitleColor, fontSize: '14px' }}
                  >
                    {t('header.explore')}
                  </Button>
                  <Menu
                      id="explore-menu"
                      anchorEl={exploreMenuEl}
                      open={Boolean(exploreMenuEl)}
                      onClose={handleMenuClose}
                      onMouseLeave={handleMenuClose}
                      disableScrollLock={true}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                      sx={{ color: pageTitleColor, fontSize: '14px' }}
                  >
                    <MenuItem component={NavLink} to="/gallery" onClick={handleMenuClose}>
                      {t('header.gallery')}
                    </MenuItem>
                    <MenuItem component={NavLink} to="https://3dmapcentral.asia/kz/#h85/103.0/5.5/108.5" onClick={handleMenuClose}>
                      {t('header.3d_tour')}
                    </MenuItem>
                    <MenuItem component={NavLink} to="/events" onClick={handleMenuClose}>
                      {t('header.events')}
                    </MenuItem>
                    <MenuItem component={NavLink} to="/video-travel" onClick={handleMenuClose}>
                      {t('header.video_travel')}
                    </MenuItem>
                    <MenuItem component={NavLink} to="/blogs" onClick={handleMenuClose}>
                      {t('header.blog')}
                    </MenuItem>
                  </Menu>
                  <Button component={NavLink} to="/places" sx={{ color: 'black', fontSize: '14px' }}>
                    {t('header.places')}
                  </Button>
                </Stack>
            )}

            {/* Қала таңдау батырмасы */}
            {!isMobile ? (
                <Button
                    variant="contained"
                    onClick={handleCityClick}
                    startIcon={<LocationOnIcon />}
                    sx={{
                      background: 'transparent',
                      color: 'black',
                      borderRadius: '15px',
                      padding: '6px 16px',
                      boxShadow: 'none',
                      '&:hover': { background: 'rgba(0, 0, 0, 0.05)' },
                    }}
                >
                  {selectedCity.icon} {getLocalizedCityName(selectedCity)} {/* ✅ Локализацияланған қала атауы */}
                </Button>
            ) : (
                <IconButton onClick={handleCityClick} sx={{ color: 'black' }}>
                  <LocationOnIcon />
                </IconButton>
            )}

            {/* Қала мәзірі */}
            <Menu
                id="city-menu"
                anchorEl={cityAnchorEl}
                open={Boolean(cityAnchorEl)}
                onClose={handleCityClose}
                disableScrollLock={true}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                PaperProps={{
                  style: {
                    width: isMobile ? '80%' : 'auto',
                    borderRadius: '12px',
                  },
                }}
            >
              {cities.map((city) => (
                  <MenuItem key={city.name} onClick={() => handleCitySelect(city)}>
                    {city.icon} {getLocalizedCityName(city)} {/* ✅ Локализацияланған қала атауы */}
                  </MenuItem>
              ))}
            </Menu>

            {/* Тіл ауыстыру (Десктоп үшін) */}
            {!isMobile && (
                <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                  <Select
                      value={i18n.language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      disableUnderline
                      sx={{ color: 'black', '& .MuiSelect-icon': { color: 'black' } }}
                  >
                    <MenuItem value="kk">ҚАЗ</MenuItem>
                    <MenuItem value="en">ENG</MenuItem>
                  </Select>
                </FormControl>
            )}

            {/* Ауа райы */}
            {weather && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                      variant="body2"
                      sx={{ color: 'black', fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                  >
                    🌤️ {weather.temperature}°C
                  </Typography>
                </Box>
            )}

            {/* Пайдаланушы аватары немесе Кіру батырмасын шартты түрде көрсету */}
            {user ? (
                <IconButton
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleUserMenuOpen}
                    sx={{ color: 'black' }}
                >
                  <Avatar
                      src={`http://localhost:8000${user?.avatar}`}
                      alt={user?.name}
                      sx={{ width: 30, height: 30 }}
                  />
                </IconButton>
            ) : (
                <IconButton
                    aria-label="login"
                    color="inherit"
                    onClick={handleLoginClick}
                    sx={{ color: 'black' }}
                >
                  <AccountCircleIcon />
                </IconButton>
            )}

            {/* Пайдаланушы мәзірі */}
            <Menu
                id="user-menu"
                anchorEl={userMenuEl}
                open={Boolean(userMenuEl)}
                onClose={handleUserMenuClose}
                disableScrollLock={true}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  style: {
                    width: isMobile ? '80%' : 'auto',
                    borderRadius: '12px',
                  },
                }}
            >
              {user && (
                  <>
                    <MenuItem component={NavLink} to="/profile" onClick={handleUserMenuClose}>
                      {t('header.profile')}
                    </MenuItem>
                    <MenuItem component={NavLink} to="/settings" onClick={handleUserMenuClose}>
                      {t('header.settings')}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>{t('header.logout')}</MenuItem>
                  </>
              )}
            </Menu>
          </DynamicIsland>
        </Container>
      </AppBar>
  );
}