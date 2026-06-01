import React, { useState } from 'react'

import {
  Box,
  TextField,
  Button,
  Rating,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const ReviewForm = ({ tourId, onReviewAdded }) => {
  const [content, setContent] = useState('')

  const [rating, setRating] = useState(5)

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
const { t } = useTranslation()
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const token = localStorage.getItem('authToken')

      console.log('Жіберілетін токен:', token)

      const response = await axios.post(
        `${API_BASE_URL}/api/reviews`, // Толық URL мекенжайы

        {
          tour_id: tourId,

          content: content,

          rating: rating,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ) // ReviewForm.jsx

      if (response.status === 200 && response.data.review) {
        // Жаңа пікір бар екенін тексеру

        setContent('')

        setRating(5)

        console.log('Жаңа пікір жауабы:', response.data.review)

        onReviewAdded(response.data.review)

        setSnackbarMessage('Пікір сәтті жіберілді!')

        setSnackbarSeverity('success')

        setSnackbarOpen(true)
      } else {
        setSnackbarMessage('Пікірді жіберу кезінде қателік кетті.')

        setSnackbarSeverity('error')

        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Пікір жіберу қателігі:', error)

      setSnackbarMessage('Пікірді жіберу кезінде қателік кетті.')

      setSnackbarSeverity('error')

      setSnackbarOpen(true)
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarOpen(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
           {' '}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t('tour_detail_page.write_review')}
      </Typography>
           {' '}
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        size="large"
        sx={{ mb: 2 }}
      />
           {' '}
      <TextField
        label={t('tour_detail_page.your_review')}
        multiline
        rows={4}
        fullWidth
        value={content}
        onChange={(event) => setContent(event.target.value)}
        sx={{ mb: 2 }}
      />
           {' '}
      <Button type="submit" variant="contained" color="primary">
        {t('tour_detail_page.submit')}
      </Button>
     
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
                    {snackbarMessage}       {' '}
        </Alert>
             {' '}
      </Snackbar>
         {' '}
    </Box>
  )
}

export default ReviewForm
