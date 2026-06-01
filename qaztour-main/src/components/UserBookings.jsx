import { Card, CardContent, Typography, CardMedia, Grid } from '@mui/material'

const UserBookings = ({ user }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Менің броньдарым
      </Typography>
      <Grid container spacing={2}>
        {user.bookings.map((booking) => (
          <Grid item xs={12} md={6} key={booking.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`/${booking.tour.image}`}
                alt={booking.tour.name}
              />
              <CardContent>
                <Typography variant="h6">{booking.tour.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.tour.description.slice(0, 100)}...
                </Typography>
                <Typography variant="body1">
                  Қатысушылар саны: {booking.seats}
                </Typography>
                <Typography variant="body1">
                  Бағасы: {booking.tour.price} ₸
                </Typography>
                <Typography
                  variant="body2"
                  color={booking.is_paid ? 'green' : 'red'}
                >
                  {booking.is_paid ? 'Төленген' : 'Төленбеген'}
                </Typography>
                <Typography variant="body2">
                  Тур күні: {booking.tour.date}
                </Typography>
                <Typography variant="caption">
                  Бронь аяқталады:{' '}
                  {new Date(booking.expires_at).toLocaleString('kk-KZ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default UserBookings
