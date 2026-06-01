import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { calculateAverageRating, getImageUrl } from '../utils/helpers'
import { useTranslation } from 'react-i18next' // useTranslation импорттау

const TopRatedToursCarousel = () => {
  const { t } = useTranslation() // t функциясын инициализациялау
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const [topRatedTours, setTopRatedTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tours/')
        const toursData = response.data?.data?.data || []
        const sortedTours = [...toursData].sort(
          (a, b) =>
            calculateAverageRating(b.reviews) -
            calculateAverageRating(a.reviews)
        )
        setTopRatedTours(sortedTours.slice(0, 5))
      } catch (err) {
        console.error('Error fetching tours:', err)
        setError(err.message || 'Failed to fetch tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: isMobile ? '10px' : isTablet ? '20px' : '70px',
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
          centerPadding: '70px',
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          centerPadding: '10px',
        },
      },
    ],
  }

  if (loading) {
    return (
      <Container sx={{ paddingBottom: 5, paddingTop: 5, textAlign: 'center' }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('homepage.top_rated_tours')} {/* Аударылған мәтін */}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'gray', mb: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          {t('homepage.explore_highest_rated_tours')} {/* Аударылған мәтін */}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="textSecondary">
            {t('tours_list_page.loading')} {/* Аударылған мәтін */}
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ paddingBottom: 5, paddingTop: 5, textAlign: 'center' }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('homepage.top_rated_tours')} {/* Аударылған мәтін */}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'gray', mb: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          {t('homepage.explore_highest_rated_tours')} {/* Аударылған мәтін */}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container sx={{ paddingBottom: 5, paddingTop: 5, textAlign: 'center' }}>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{ fontWeight: 'bold', mb: 2 }}
      >
        {t('homepage.top_rated_tours')} {/* Аударылған мәтін */}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'gray', mb: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}
      >
        {t('homepage.explore_highest_rated_tours')} {/* Аударылған мәтін */}
      </Typography>
      <Slider {...settings}>
        {topRatedTours.map((tour, index) => (
          <motion.div
            key={tour.id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '15px', textAlign: 'center' }}
            onClick={() => navigate(`/tour/${tour.id}`)}
          >
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: '100px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: '0.3s',
                '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.3)' },
                margin: '0 10px',
              }}
            >
              <motion.img
                src={getImageUrl(tour.image)}
                alt={tour.name}
                style={{
                  width: '100%',
                  height: isMobile ? '180px' : '220px',
                  objectFit: 'cover',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </Box>
            <Typography
              variant={isMobile ? 'h6' : 'h6'}
              sx={{
                mt: 2,
                fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.1rem',
              }}
            >
              {tour.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'gray',
                marginTop: '5px',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
              }}
            >
              {t('tours_list_page.rating')}:{' '}
              {calculateAverageRating(tour.reviews).toFixed(1)}{' '}
              {/* Аударылған мәтін */}
            </Typography>
          </motion.div>
        ))}
      </Slider>
    </Container>
  )
}

export default TopRatedToursCarousel
