import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/material'
import Input from '@mui/joy/Input'
import FormLabel from '@mui/joy/FormLabel'
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize'
import { styled } from '@mui/system'
import myImage from './../assets/photos/5118759.jpg'

const MapsGoogle = () => {
  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  }

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  }

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
        box-sizing: border-box;
        width: 320px;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${
          theme.palette.mode === 'dark' ? grey[700] : grey[200]
        };
        box-shadow: 0 2px 2px ${
          theme.palette.mode === 'dark' ? grey[900] : grey[50]
        };
    
        &:hover {
          border-color: ${blue[400]};
        }
    
        &:focus {
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${
            theme.palette.mode === 'dark' ? blue[600] : blue[200]
          };
        }
    
        /* firefox */
        &:focus-visible {
          outline: 0;
        }
      `
  )
  const containerStyle = {
    width: '100%',
    height: '400px',
  }

  const center = {
    lat: 40.748817, // Latitude of the center of the map
    lng: -73.985428, // Longitude of the center of the map
  }

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyB2saYbby3D1MCfVV_7KxGn1c9oqgXn-Js">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      <Container>
        <br />
        <br />
        <br />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <img
                src={myImage}
                alt="a map"
                style={{ width: '80%', borderRadius: 10 }}
              />
            </Grid>
            <Grid size={6}>
              <Card
                sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.3)', minWidth: 275 }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    Get in touch !
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <FormLabel sx={{ paddingBottom: 2 }}>
                          Your Name:
                        </FormLabel>
                        <Input placeholder="Name" />
                      </Grid>
                      <Grid size={6}>
                        <FormLabel sx={{ paddingBottom: 2 }}>
                          Your Email:
                        </FormLabel>
                        <Input placeholder="Email" />
                      </Grid>
                    </Grid>
                  </Box>
                  <br />
                  <FormLabel sx={{ paddingBottom: 2 }}>
                    Your Question:
                  </FormLabel>
                  <Input placeholder="Subject:" />
                  <br />
                  <FormLabel sx={{ paddingBottom: 2 }}>Your Comment:</FormLabel>
                  <Textarea
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Minimum 3 rows"
                    style={{ width: '100%' }}
                  />
                  <Button variant="contained">Learn More</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <br />
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            sx={{ justifyContent: 'center', textAlign: 'center' }}
            container
            spacing={2}
          >
            <Grid size={4}>
              <h4>Phone</h4>
              <p>
                The phrasal sequence of the is now so that many campaign and
                benefit
              </p>
              +152 534-468-854
            </Grid>
            <Grid size={4}>
              <h4>Email</h4>
              <p>
                The phrasal sequence of the is now so that many campaign and
                benefit
              </p>
              contact@example.com
            </Grid>
            <Grid size={4}>
              <h4>Location</h4>
              <p>C/54 Northwest Freeway, Suite 558, Houston, USA 485</p>

              <Button>View on Google map</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <br />
    </div>
  )
}
export default MapsGoogle
