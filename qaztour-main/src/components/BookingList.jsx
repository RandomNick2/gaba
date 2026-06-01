import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  useTheme,
  styled,
  Alert,
  Snackbar 
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'


// Иконкаларды импорттау
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EventSeatIcon from '@mui/icons-material/EventSeat'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import DeleteIcon from '@mui/icons-material/Delete'
import PaymentsIcon from '@mui/icons-material/Payments'
import { useTranslation } from 'react-i18next'
// PayPal импорттары
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

// CountdownTimer компонентасын өз жолыңыз бойынша импорттаңыз
import CountdownTimer from './CountdownTimer' // Жолды тексеріңіз

// --- Styled Components ---

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
}))

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '2.5rem',
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}))

const BookingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}))

const BookingCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: 200,
  objectFit: 'cover',
  [theme.breakpoints.up('md')]: {
    width: 250,
    height: 'auto',
  },
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  [theme.breakpoints.up('md')]: {
    borderRadius: `${theme.spacing(2)} 0 0 ${theme.spacing(2)}`,
  },
}))

const StatusChip = styled(Box)(({ theme, status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(1),
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '0.85rem',
  color: theme.palette.common.white,
  backgroundColor:
    status === 'Төленді'
      ? theme.palette.success.main
      : status === 'Бас тартылды'
      ? theme.palette.error.main
      : status === 'Күту'
      ? theme.palette.warning.main
      : theme.palette.grey[500],
}))

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderRadius: theme.spacing(1),
  fontSize: '0.8rem',
  padding: theme.spacing(0.8, 1.5),
}))

// --- Helper function for image URL ---
const BASE_URL = 'http://127.0.0.1:8000/storage/'
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/250x200?text=Tour+Image'
  if (imagePath.startsWith('http')) return imagePath
  return `${BASE_URL}${encodeURIComponent(imagePath)}`
}

const BookingList = () => {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [openPayPalDialog, setOpenPayPalDialog] = useState(false) // ✅ PayPal диалогын басқару
  const [bookingToPay, setBookingToPay] = useState(null) // ✅ Төленетін бронь
  const theme = useTheme()
const [alert, setAlert] = useState({ open: false, severity: '', message: '' });

const showAlert = (severity, message) => {
  setAlert({ open: true, severity, message });
};

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Броньдарды көру үшін кіру қажет.')
        setLoading(false)
        return
      }
      const response = await axios.get(
        `http://localhost:8000/api/bookings/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setBookings(response.data.data || response.data)
    } catch (err) {
      console.error('Броньдарды жүктеу кезінде қате кетті:', err)
      setError(err.message || 'Броньдарды жүктеу мүмкін болмады.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleConfirmCancel = (id) => {
    setBookingToCancel(id)
    setOpenConfirmDialog(true)
  }

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
    setBookingToCancel(null)
  }

  const handleCancel = async () => {
    if (!bookingToCancel) return

    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`/api/bookings/${bookingToCancel}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setBookings(bookings.filter((b) => b.id !== bookingToCancel))
      handleCloseConfirmDialog()
    } catch (error) {
      console.error('Броньды жою кезінде қате кетті:', error)
      showAlert('error','Броньды жою кезінде қате кетті.')
    }
  }

  // ✅ PayPal төлемін бастау
  const handlePaypalClick = (booking) => {
    setBookingToPay(booking)
    setOpenPayPalDialog(true)
  }

  // ✅ PayPal ордерін жасау (Frontend-тен Backend-ке сұрау)
  const createOrder = async (data, actions) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('Авторизация токені жоқ.')

      const response = await axios.post(
        'http://localhost:8000/api/paypal/create-order',
        { booking_id: bookingToPay.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data.orderID
    } catch (error) {
      console.error(
        'PayPal ордерін жасау қатесі:',
        error.response?.data || error.message
      )
      showAlert('error',
        'PayPal ордерін жасау кезінде қате пайда болды: ' +
          (error.response?.data?.message || error.message)
      )
      setOpenPayPalDialog(false) // Диалогты жабу
      throw error // Қатені қайта лақтыру, PayPal SDK өңдейді
    }
  }

  // ✅ PayPal төлемін орындау (Frontend-тен Backend-ке сұрау)
  const onApprove = async (data, actions) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('Авторизация токені жоқ.')

      const response = await axios.post(
        'http://localhost:8000/api/paypal/capture-order',
        { orderID: data.orderID },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      console.log('PayPal төлемі сәтті аяқталды:', response.data)
      showAlert('success','Төлем сәтті аяқталды!')
      setOpenPayPalDialog(false) // Диалогты жабу
      fetchBookings() // Броньдар тізімін жаңарту
    } catch (error) {
      console.error(
        'PayPal төлемін орындау қатесі:',
        error.response?.data || error.message
      )
      showAlert('error',
        'PayPal төлемін орындау кезінде қате пайда болды: ' +
          (error.response?.data?.message || error.message)
      )
      setOpenPayPalDialog(false) // Диалогты жабу
    }
  }

  // ✅ PayPal қатесі
  const onError = (err) => {
    console.error('PayPal Error:', err)
    showAlert('error','PayPal төлемі кезінде қате пайда болды.')
    setOpenPayPalDialog(false) // Диалогты жабу
  }

  const getStatusDisplay = (isPaid, status) => {
    if (isPaid) {
      return (
        <StatusChip status="Төленді">
          <CheckCircleOutlineIcon sx={{ mr: 0.5 }} /> Төленді
        </StatusChip>
      )
    } else if (status === 'cancelled') {
      return (
        <StatusChip status="Бас тартылды">
          <CancelOutlinedIcon sx={{ mr: 0.5 }} /> Бас тартылды
        </StatusChip>
      )
    } else if (status === 'pending') {
      return (
        <StatusChip status="Күту">
          <PendingActionsIcon sx={{ mr: 0.5 }} /> Күту
        </StatusChip>
      )
    }
    return <StatusChip status="Белгісіз">Белгісіз</StatusChip>
  }

  if (loading) {
    return (
      <StyledContainer sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography mt={2}>Броньдар жүктелуде...</Typography>
      </StyledContainer>
    )
  }

  if (error) {
    return (
      <StyledContainer sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          Қате: {error}
        </Typography>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <PageTitle>Менің брондарым</PageTitle>

      {bookings.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Сізде ешқандай брондау жоқ.
        </Typography>
      ) : (
        <Box>
          {bookings.map((b, i) => (
            <BookingCard key={b.id}>
              <BookingCardMedia
                image={getImageUrl(b.tour?.image)}
                title={b.tour?.name ?? '—'}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {b.tour?.name ?? 'Тур атауы жоқ'}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon
                      sx={{
                        mr: 1,
                        color: 'text.secondary',
                        fontSize: '1.2rem',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {b.tour?.location?.name ?? '—'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon
                      sx={{
                        mr: 1,
                        color: 'text.secondary',
                        fontSize: '1.2rem',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {b.tour?.date
                        ? new Date(b.tour.date).toLocaleDateString()
                        : '—'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EventSeatIcon
                      sx={{
                        mr: 1,
                        color: 'text.secondary',
                        fontSize: '1.2rem',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Орын саны: {b.seats}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AttachMoneyIcon
                      sx={{
                        mr: 1,
                        color: 'text.secondary',
                        fontSize: '1.2rem',
                      }}
                    />
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      Жалпы баға:{' '}
                      {(
                        (b.seats * parseFloat(b.tour?.price ?? 0)) /
                        520
                      ).toFixed(2)}{' '}
                      ₸
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {getStatusDisplay(b.is_paid, b.status)}

                  {!b.is_paid && b.status === 'pending' && b.expires_at ? (
                    <Box display="flex" alignItems="center" ml={2}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mr={1}
                      >
                        Уақыт қалды:
                      </Typography>
                      <CountdownTimer expiresAt={b.expires_at} />
                    </Box>
                  ) : (
                    <Box sx={{ width: '100px' }}></Box>
                  )}
                </Box>
              </CardContent>

              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {!b.is_paid && b.status === 'pending' ? (
                  <>
                    <ActionButton
                      variant="contained"
                      color="primary"
                      startIcon={<PaymentsIcon />}
                      onClick={() => handlePaypalClick(b)} // ✅ onClick өңдеушісі
                    >
                      Төлеу
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      color="error"
                      startIcon={<CancelOutlinedIcon />}
                      onClick={() => handleConfirmCancel(b.id)}
                    >
                      Бас тарту
                    </ActionButton>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Әрекет жоқ
                  </Typography>
                )}
              </Box>
            </BookingCard>
          ))}
        </Box>
      )}

      {/* Жоюды растау диалогы */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Брондауды жоюды растау'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Сіз бұл брондауды жоюға сенімдісіз бе? Бұл әрекетті қайтару мүмкін
            емес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Жоқ
          </Button>
          <Button onClick={handleCancel} color="error" autoFocus>
            Иә, жою
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ PayPal төлем диалогы */}
      <Dialog
        open={openPayPalDialog}
        onClose={() => setOpenPayPalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>PayPal арқылы төлеу</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Төлемді аяқтау үшін PayPal батырмасын басыңыз. Жалпы сома: ₸
            {bookingToPay
              ? (
                  (bookingToPay.seats *
                    parseFloat(bookingToPay.tour?.price ?? 0)) /
                  520
                ).toFixed(2)
              : '—'}
          </DialogContentText>
          {bookingToPay && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <PayPalScriptProvider
                options={{
                  'client-id':
                    'AYrGzAFKitQwR53r3vMV9RHt0Wrygn7UQNvhZBEbFkWvj7mAsbl3EKP7gBvePDUX2LQm6C87vSAF2TFm',
                  currency: 'USD',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', tagline: false }} // Модаль үшін vertical стилі
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayPalDialog(false)} color="secondary">
            Жабу
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
  open={alert.open}
  autoHideDuration={6000}
  onClose={() => setAlert({ ...alert, open: false })}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={() => setAlert({ ...alert, open: false })}
    severity={alert.severity}
    sx={{ width: '100%' }}
  >
    {alert.message}
  </Alert>
</Snackbar>

    </StyledContainer>
  )
}

export default BookingList
