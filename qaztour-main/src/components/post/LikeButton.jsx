import React, { useState, useEffect } from 'react'
import { IconButton, Typography, Box, keyframes } from '@mui/material' // Box және keyframes импорттау
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CircularProgress from '@mui/material/CircularProgress' // CircularProgress импорттау
import { styled, useTheme } from '@mui/material/styles' // styled және useTheme импорттау
import api from '../../utils/axios'

// --- Styled Components & Keyframes for animation ---
const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`

const StyledLikeButton = styled(IconButton)(({ theme, liked }) => ({
  transition: 'color 0.3s ease-in-out, transform 0.2s ease-in-out',
  color: liked ? theme.palette.error.main : theme.palette.text.secondary, // Лайк басылса қызыл түс
  '&:hover': {
    color: liked ? theme.palette.error.dark : theme.palette.primary.main, // Тышқанды апарғанда түсі өзгеру
    transform: 'scale(1.1)',
  },
  // Басқандағы анимация (стильдік эффект)
  '&.Mui-focusVisible': {
    animation: `${pop} 0.3s ease-in-out`,
  },
}))

const LikeCountTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  minWidth: '20px', // Санның орны тұрақты болуы үшін
  textAlign: 'left',
}))

const LikeButton = ({ postId, initialLiked }) => {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(null) // Бастапқыда null
  const [loadingAction, setLoadingAction] = useState(false) // Лайк басу әрекетінің жүктелуі
  const theme = useTheme() // Теманы пайдалану үшін

  useEffect(() => {
    // Бастапқы лайктар санын алу (компонент орнатылғанда)
    const fetchInitialLikeCount = async () => {
      try {
        const response = await api.get(`/posts/${postId}`)
        // API жауабының құрылымын тексеріңіз.
        // Сіздің API /posts/{id} маршрутында `likes` массивін қайтарады деп болжаймыз.
        const currentPostData = Array.isArray(response.data)
          ? response.data[0]
          : response.data
        setLikeCount(currentPostData.likes?.length || 0)
      } catch (error) {
        console.error('Бастапқы лайктар санын алу кезінде қате кетті:', error)
        setLikeCount(0) // Қателік болса, 0 деп қабылдаймыз
      }
    }

    fetchInitialLikeCount()
  }, [postId])

  const handleLike = async () => {
    if (loadingAction) return // Егер әрекет жүктеліп жатса, қайталамау

    setLoadingAction(true)
    try {
      // Interceptor арқылы токен автоматты түрде жіберіледі
      let response
      if (liked) {
        response = await api.delete(`/posts/${postId}/like`)
        setLiked(false)
        // setLikeCount(prevCount => prevCount - 1); // Егер бекенд жаңартылған санды қайтармаса
      } else {
        response = await api.post(`/posts/${postId}/like`)
        setLiked(true)
        // setLikeCount(prevCount => prevCount + 1); // Егер бекенд жаңартылған санды қайтармаса
      }

      // Бекендтен жаңартылған лайктар санын алу (егер API жауабында болса)
      if (
        response &&
        response.data &&
        response.data.likes_count !== undefined
      ) {
        setLikeCount(response.data.likes_count)
      } else {
        // Егер бекенд лайк санын қайтармаса, фронттағы күйді жаңарту
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1))
      }
    } catch (error) {
      console.error('Лайк басу кезінде қате кетті:', error)
      // Қате туралы пайдаланушыға хабарлауға болады
    } finally {
      setLoadingAction(false)
    }
  }

  if (likeCount === null) {
    return (
      <Box display="flex" alignItems="center">
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <LikeCountTypography>...</LikeCountTypography>
      </Box>
    )
  }

  return (
    <Box display="flex" alignItems="center">
      <StyledLikeButton
        aria-label="like"
        onClick={handleLike}
        liked={liked ? 1 : 0}
        disabled={loadingAction}
      >
        {loadingAction ? (
          <CircularProgress size={20} color="inherit" />
        ) : liked ? (
          <FavoriteIcon />
        ) : (
          <FavoriteBorderIcon />
        )}
      </StyledLikeButton>
      <LikeCountTypography>{likeCount}</LikeCountTypography>
    </Box>
  )
}

export default LikeButton
