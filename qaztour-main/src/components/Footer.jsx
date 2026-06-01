import * as React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import { Container, Typography, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Input from '@mui/joy/Input'
import MailIcon from '@mui/icons-material/Mail'
import Button from '@mui/material/Button'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { useTranslation } from 'react-i18next' // useTranslation импорттау

export default function Footer() {
  const { t } = useTranslation() // t функциясын инициализациялау
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    color: '#fff',
    padding: theme.spacing(2),
    textAlign: 'left',
    boxShadow: 'none',
  }))

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #002569, #002569)',
        color: 'white',
        paddingTop: 12,
        paddingBottom: 10,
        mt: 5,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -110,
          left: 0,
          width: '100%',
          height: '120px',
          marginTop: '-1px',
        }}
      >
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{ height: '100%', width: '100%' }}
        >
          <path
            d="M-2.54,95.23 C222.63,199.84 369.35,37.02 501.97,99.19 L500.00,150.00 L0.00,150.00 Z"
            style={{ stroke: 'none', fill: '#002569' }}
          />
        </svg>
      </Box>

      <Container>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Item>
              <Typography variant="h6" fontWeight={600}>
                {t('footer.about_us')}
              </Typography>{' '}
              {/* Аударылған мәтін */}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t('tours_list_page.planning_trip')} {/* Аударылған мәтін */}
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Item>
              <Typography variant="h6" fontWeight={600}>
                {t('footer.office')}
              </Typography>{' '}
              {/* Аударылған мәтін */}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Aventra
                <br />
                Almaty
                <br />
                Zhualy, 15
                <br />
                aventra@gmail.com
                <br />
                +7 777 157 0165
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Item>
              <Typography variant="h6" fontWeight={600}>
                {t('footer.company')}
              </Typography>{' '}
              {/* Аударылған мәтін */}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t('footer.about_us')}
                <br /> {/* Аударылған мәтін */}
                {t('footer.services')}
                <br /> {/* Аударылған мәтін */}
                {t('footer.team')}
                <br /> {/* Аударылған мәтін */}
                {t('footer.pricing')}
                <br /> {/* Аударылған мәтін */}
                {t('footer.blog')}
                <br /> {/* Аударылған мәтін */}
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Item>
              <Typography variant="h6" fontWeight={600}>
                {t('footer.newsletter')}
              </Typography>{' '}
              {/* Аударылған мәтін */}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t('footer.sign_up_receive_tips')}
              </Typography>{' '}
              {/* Аударылған мәтін */}
              <Box
                sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}
              >
                <Input
                  startDecorator={<MailIcon />}
                  placeholder={t('footer.your_email')}
                  sx={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    padding: '8px',
                    '&:focus': {
                      borderColor: '#ff9800',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    width: 200,
                    background: 'linear-gradient(135deg, #ff9800, #ff7300)',
                    color: '#fff',
                    borderRadius: 3,
                    '&:hover': {
                      background: '#ff9800',
                    },
                  }}
                >
                  {t('footer.subscribe')} {/* Аударылған мәтін */}
                </Button>
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <IconButton sx={{ color: 'white' }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <TwitterIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <InstagramIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <LinkedInIcon />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mt: 4, opacity: 0.6 }}
        >
          &copy; {new Date().getFullYear()} QazTour. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}
