import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import api from '../../utils/axios'; // Axios инстансы
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импорттау

// --- Styled Components (өзгеріссіз қалады) ---

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '2.5rem',
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1.5, 0),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: theme.typography.fontWeightBold,
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const UploadIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const StyledPreviewImage = styled('img')(({ theme }) => ({
  height: 100,
  width: 'auto',
  borderRadius: theme.spacing(1),
  marginLeft: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  objectFit: 'cover',
}));

// --- Main Component ---
const CreatePost = () => {
  const [title, setTitle] = useState(''); // ✅ Title күйін қосу (егер постқа қажет болса)
  const [content, setContent] = useState('');
  const [savedImage, setSavedImage] = useState(null);
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // ✅ useTranslation хукі

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/api/locations');
        // ✅ API жауабындағы "data" немесе тікелей массив
        setLocations(response.data.data || response.data);
        setLocationsLoading(false);
      } catch (error) {
        console.error('Локацияларды жүктеу кезінде қате кетті:', error);
        setLocationsError(t('create_post.location_loading_error')); // ✅ Локализация
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, [t]); // ✅ 't' функциясын тәуелділікке қосу

  const handleTitleChange = (event) => { // ✅ Title өзгерту функциясы
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSavedImage(file);
  };

  const handleLocationIdChange = (event) => {
    setLocationId(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ✅ Front-end валидация: title, content, locationId міндетті
    if (!title.trim() || !content.trim() || !locationId) {
      setError(t('create_post.all_fields_required_error')); // ✅ Локализация
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim()); // ✅ Title-ді қосу
      formData.append('content', content.trim());
      if (savedImage) {
        formData.append('image', savedImage);
      }
      formData.append('location_id', locationId);

      const response = await api.post('/posts', formData);

      console.log('Пост жарияланды:', response.data);
      setTitle(''); // ✅ Title-ді тазалау
      setContent('');
      setSavedImage(null);
      setLocationId('');
      setLoading(false);
      alert(t('create_post.post_published_success')); // ✅ Локализация
      navigate('/profile');
    } catch (err) {
      setError(
          err.response?.data?.message ||
          err.message ||
          t('create_post.post_publish_error') // ✅ Локализация
      );
      setLoading(false);
      console.error('Постты жариялау қатесі:', err.response?.data || err);
    }
  };

  return (
      <>
        <Header />
        <FormContainer maxWidth="md">
          <FormPaper elevation={3}>
            <FormTitle variant="h4">{t('create_post.new_post_heading')}</FormTitle> {/* ✅ Локализация */}

            {/* ✅ Title TextField */}
            <StyledTextField
                label={t('create_post.title_label')} // ✅ Локализация
                fullWidth
                value={title}
                onChange={handleTitleChange}
                margin="normal"
                required
            />

            <StyledTextField
                label={t('create_post.share_thoughts_label')} // ✅ Локализация
                multiline
                rows={4}
                fullWidth
                value={content}
                onChange={handleContentChange}
                required
                margin="normal" // margin prop-ын қосу
            />

            <FormControl fullWidth margin="normal" disabled={locationsLoading}>
              <InputLabel id="location-id-label" required>
                {t('create_post.select_location_label')}
              </InputLabel>
              <Select
                  labelId="location-id-label"
                  id="location-id"
                  value={locationId}
                  label={t('create_post.select_location_label')} // ✅ Локализация
                  onChange={handleLocationIdChange}
                  required
              >
                <MenuItem value="">
                  <em>{t('common.none')}</em>
                </MenuItem>
                {locations.map((location) => {
                  // ✅ Локация атауын локализациялау
                  const currentLang = i18n.language;
                  const localizedLocationName =
                      location[`name_${currentLang}`] ||
                      location.name_en ||
                      location.name_kz ||
                      location.name || // Егер API-да тек name болса
                      '—';

                  return (
                      <MenuItem key={location.id} value={location.id}>
                        {localizedLocationName} {/* ✅ Локализацияланған локация атауы */}
                      </MenuItem>
                  );
                })}
              </Select>
              {locationsError && (
                  <Typography color="error" sx={{ mt: 1, fontSize: '0.85rem' }}>
                    {t('common.error')}: {locationsError}
                  </Typography>
              )}
              {locationsLoading && (
                  <Typography
                      color="textSecondary"
                      sx={{ mt: 1, fontSize: '0.85rem' }}
                  >
                    {t('create_post.loading_locations')}...
                  </Typography>
              )}
            </FormControl>

            <ImageUploadBox>
              <UploadIconButton color="primary" component="label">
                <PhotoCamera />
                <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                />
              </UploadIconButton>
              <Typography sx={{ ml: 1, color: theme.palette.text.secondary }}>
                {t('create_post.add_image')}
              </Typography>
              {savedImage && (
                  <StyledPreviewImage
                      src={URL.createObjectURL(savedImage)}
                      alt={t('create_post.uploaded_image_alt')}
                  />
              )}
            </ImageUploadBox>

            {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                  {error}
                </Alert>
            )}

            <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                    loading ||
                    locationsLoading ||
                    locationsError ||
                    (locations.length === 0 && !locationId)
                }
            >
              {loading ? (
                  <CircularProgress size={24} color="inherit" />
              ) : (
                  t('create_post.publish_button') /* ✅ Локализация */
              )}
            </SubmitButton>
          </FormPaper>
        </FormContainer>
        <Footer />
      </>
  );
};

export default CreatePost;