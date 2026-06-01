import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Modal,
  IconButton,
  useMediaQuery, // ✅ useMediaQuery импортталды
  useTheme, // ✅ useTheme импортталды
} from '@mui/material';
import {
  TravelExplore,
  Language,
  LocalDining,
  Security,
  DirectionsCar,
  MedicalServices,
  Close,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импортталды

export default function TouristInfo() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation(); // ✅ t (translate) функциясын аламыз
  const theme = useTheme(); // ✅ Теманы алу
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // ✅ Мобильді экранды анықтау

  const infoItems = [
    {
      icon: <TravelExplore fontSize="large" />,
      title: t('tourist_info_page.visa_requirements.title'), // ✅ Жаңа кілт
      desc: t('tourist_info_page.visa_requirements.desc'),   // ✅ Жаңа кілт
      content: t('tourist_info_page.visa_requirements.content'), // ✅ Жаңа кілт (барлық мәтін)
    },
    {
      icon: <Language fontSize="large" />,
      title: t('tourist_info_page.language_barriers.title'),
      desc: t('tourist_info_page.language_barriers.desc'),
      content: t('tourist_info_page.language_barriers.content'),
    },
    {
      icon: <LocalDining fontSize="large" />,
      title: t('tourist_info_page.local_cuisine.title'),
      desc: t('tourist_info_page.local_cuisine.desc'),
      content: t('tourist_info_page.local_cuisine.content'),
    },
    {
      icon: <Security fontSize="large" />,
      title: t('tourist_info_page.safety_measures.title'),
      desc: t('tourist_info_page.safety_measures.desc'),
      content: t('tourist_info_page.safety_measures.content'),
    },
    {
      icon: <DirectionsCar fontSize="large" />,
      title: t('tourist_info_page.transport_directions.title'),
      desc: t('tourist_info_page.transport_directions.desc'),
      content: t('tourist_info_page.transport_directions.content'),
    },
    {
      icon: <MedicalServices fontSize="large" />,
      title: t('tourist_info_page.medical_assistance.title'),
      desc: t('tourist_info_page.medical_assistance.desc'),
      content: t('tourist_info_page.medical_assistance.content'),
    },
  ];

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)',
          py: isMobile ? 4 : 8, // ✅ Мобильдіде padding азайту
        }}
      >
        <Container sx={{ paddingX: isMobile ? 2 : 4 }}> {/* ✅ Мобильдіде paddingX азайту */}
          <Typography
            variant={isMobile ? "h5" : "h4"} // ✅ Мобильдіде қаріпті кішірейту
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'white',
              mb: isMobile ? 2 : 4, // ✅ Мобильдіде margin-bottom азайту
            }}
          >
            {t('tourist_info_page.useful_info_for_tourist')}
          </Typography>
          <Grid container spacing={isMobile ? 2 : 4}> {/* ✅ Мобильдіде spacing азайту */}
            {infoItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}> {/* ✅ Мобильдіде толық ені, планшетте жарты, десктопта үштен бір */}
                <Card
                  sx={{
                    p: isMobile ? 2 : 3, // ✅ Мобильдіде padding азайту
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: '0.3s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                  onClick={() => handleOpen(item)}
                >
                  <Box sx={{ color: '#0077b6', mb: isMobile ? 1 : 2 }}>{item.icon}</Box> {/* ✅ Мобильдіде margin-bottom азайту */}
                  <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold"> {/* ✅ Мобильдіде қаріпті кішірейту */}
                    {item.title}
                  </Typography>
                  <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary"> {/* ✅ Мобильдіде қаріпті кішірейту */}
                    {item.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Modal терезесі */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            bgcolor: 'white',
            p: isMobile ? 2 : 4, // ✅ Мобильдіде padding азайту
            borderRadius: 2,
            width: isMobile ? '95%' : '90%', // ✅ Мобильдіде енін реттеу
            maxWidth: isMobile ? 'calc(100% - 32px)' : 600, // ✅ Мобильдіде максималды енін реттеу
            mx: 'auto',
            mt: isMobile ? 5 : 10, // ✅ Мобильдіде margin-top реттеу
            boxShadow: 24,
            position: 'relative',
            maxHeight: isMobile ? '90vh' : '80vh', // ✅ Мобильдіде максималды биіктігі
            overflowY: 'auto', // ✅ Модаль ішіндегі скролл
          }}
        >
          <IconButton
            sx={{ position: 'absolute', right: 10, top: 10 }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>

          {selectedItem && (
            <>
              <Typography
                variant={isMobile ? "h6" : "h5"} // ✅ Мобильдіде қаріпті кішірейту
                fontWeight="bold"
                sx={{ mb: 2, color: '#0077b6', textAlign: 'center' }}
              >
                {selectedItem.title}
              </Typography>

              <Box sx={{ maxHeight: isMobile ? '70vh' : '60vh', overflowY: 'auto', pr: 2 }}> {/* ✅ Мобильдіде биіктікті реттеу */}
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ lineHeight: 1.6, whiteSpace: 'pre-line', fontSize: isMobile ? '0.875rem' : '1rem' }} // ✅ Мобильдіде қаріпті кішірейту
                >
                  {selectedItem.content}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}