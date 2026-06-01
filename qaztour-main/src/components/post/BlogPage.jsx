import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material'
import PostCard from './PostCard' // PostCard компонентінің жолы дұрыс екенін тексеріңіз
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import api from './../../utils/axios' // Axios инстансы
import { useNavigate } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// --- Styled Components for enhanced aesthetics ---
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '2.8rem',
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(3),
  // textAlign: 'center', // ✅ Ортаға теңшеуді алып тастадық
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  flexGrow: 1, // ✅ Тақырыптың бос орынды алуы үшін
  textAlign: 'center', // ✅ Тақырыптың өзін ортаға теңшеу
}))

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  maxWidth: 800,
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
}))

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(14),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(8),
  },
}))

const StyledGoBackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.action.active,
  '&:hover': {
    color: theme.palette.primary.main,
  },
  // marginRight: theme.spacing(1), // ✅ Тақырыптан аздап бос орын (қажет болса қалдыру)
}))

const BlogPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts')
        setPosts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError('Блог жазбаларын жүктеу кезінде қате кетті.')
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleGoBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <StyledContainer sx={{ textAlign: 'center', py: 10 }}>
        <CircularProgress />
        <Typography mt={2}>Блог жазбалары жүктелуде...</Typography>
      </StyledContainer>
    )
  }

  if (error) {
    return (
      <StyledContainer sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" color="error">
          Қате: {error}
        </Typography>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer maxWidth="md">
      {/* Тақырыптар мен Артқа батырмасы */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(3),
        }}
      >
        {' '}
        {/* justifyContent: 'center' алып тасталды */}
        <StyledGoBackButton onClick={handleGoBack} aria-label="go back">
          <ArrowBackIosIcon />
        </StyledGoBackButton>
        <SectionTitle component="h1" gutterBottom={false}>
          📖 Блог жазбалары
        </SectionTitle>
      </Box>
      <SectionSubtitle>
        Саяхаттар, қызықты оқиғалар және пайдалы кеңестер туралы жазбалар.
        Өзіңізге ұнағанды оқып, шабыт алыңыз!
      </SectionSubtitle>

      {/* Посттар тізімі */}
      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              mt={4}
            >
              Блог жазбалары әлі қосылмаған.
            </Typography>
          </Grid>
        )}
      </Grid>
    </StyledContainer>
  )
}

export default BlogPage
