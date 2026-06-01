import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  Container,
  Avatar,
  Rating,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Link,
  Grid,
} from '@mui/material'
import Header from './Header'

const providers = [
  {
    id: 1,
    name: 'TravelGo',
    rating: 4.6,
    image: 'https://via.placeholder.com/100',
    description:
      'Expert in international tours with over 10 years of experience.',
    contact: {
      phone: '+1 234 567 890',
      email: 'contact@travelgo.com',
      address: '123 Main Street, City, Country',
    },
    services: ['International Tours', 'Flight Booking', 'Hotel Reservations'],
    social: {
      facebook: 'https://facebook.com/travelgo',
      instagram: 'https://instagram.com/travelgo',
    },
    tours: [
      { title: 'European Adventure', price: 1500, id: 101 },
      { title: 'Beach Getaway', price: 1200, id: 102 },
    ],
  },
  {
    id: 2,
    name: 'Adventure Seekers',
    rating: 4.7,
    image: 'https://via.placeholder.com/100',
    description: 'Specialized in adventure and trekking tours.',
    contact: {
      phone: '+1 987 654 321',
      email: 'info@adventureseekers.com',
      address: '456 Mountain Road, City, Country',
    },
    services: ['Hiking', 'Camping', 'Wildlife Safaris'],
    social: {
      facebook: 'https://facebook.com/adventureseekers',
      instagram: 'https://instagram.com/adventureseekers',
    },
    tours: [
      { title: 'Mountain Trekking', price: 900, id: 201 },
      { title: 'Jungle Expedition', price: 1100, id: 202 },
    ],
  },
]

const Provider = () => {
  const { id } = useParams()
  const provider = providers.find((p) => p.id === Number(id))

  if (!provider) {
    return (
      <Typography
        variant="h5"
        sx={{ textAlign: 'center', mt: 5, color: 'error.main' }}
      >
        Provider not found
      </Typography>
    )
  }

  return (
    <>
      <Header />
      <Container sx={{ py: 5, pt: 14 }}>
        <Card sx={{ p: 4, textAlign: 'center', boxShadow: 5 }}>
          <Avatar
            src={provider.image}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h4" fontWeight="bold">
            {provider.name}
          </Typography>
          <Rating
            value={provider.rating}
            precision={0.5}
            readOnly
            sx={{ mt: 1 }}
          />
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mt: 2 }}
          >
            {provider.description}
          </Typography>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            Contact Information
          </Typography>
          <Typography variant="body2">📞 {provider.contact.phone}</Typography>
          <Typography variant="body2">📧 {provider.contact.email}</Typography>
          <Typography variant="body2">📍 {provider.contact.address}</Typography>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            Services
          </Typography>
          <List>
            {provider.services.map((service, index) => (
              <ListItem key={index}>
                <ListItemText primary={service} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            Available Tours
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {provider.tours.map((tour) => (
              <Grid item xs={12} sm={6} key={tour.id}>
                <Card sx={{ p: 2, textAlign: 'center', boxShadow: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {tour.title}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ my: 1 }}>
                    ${tour.price}
                  </Typography>
                  <Button variant="contained" color="success">
                    Buy Now
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            Follow Us
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href={provider.social.facebook}
              target="_blank"
            >
              Facebook
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              href={provider.social.instagram}
              target="_blank"
            >
              Instagram
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  )
}

export default Provider
