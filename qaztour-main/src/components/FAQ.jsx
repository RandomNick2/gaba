import React from 'react'
import { Container, Box, Paper, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import AccordionGroup from '@mui/joy/AccordionGroup'
import Accordion from '@mui/joy/Accordion'
import AccordionDetails from '@mui/joy/AccordionDetails'
import AccordionSummary from '@mui/joy/AccordionSummary'
import myImage from './../assets/photos/traveller-bag-mountains-isolation-1151553.jpg'
import { useTranslation } from 'react-i18next' // useTranslation импорттау

const Item = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'left',
  backgroundColor: '#f9f9f9',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
}))

const FAQ = () => {
  const { t } = useTranslation() // t функциясын инициализациялау
  const questions = [
    {
      q: t('homepage.frequently_asked_questions.q1'), // Жаңа аударма кілттері
      a: t('homepage.frequently_asked_questions.a1'),
    },
    {
      q: t('homepage.frequently_asked_questions.q2'),
      a: t('homepage.frequently_asked_questions.a2'),
    },
    {
      q: t('homepage.frequently_asked_questions.q3'),
      a: t('homepage.frequently_asked_questions.a3'),
    },
    {
      q: t('homepage.frequently_asked_questions.q4'),
      a: t('homepage.frequently_asked_questions.a4'),
    },
    {
      q: t('homepage.frequently_asked_questions.q5'),
      a: t('homepage.frequently_asked_questions.a5'),
    },
  ]

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100px',
          overflow: 'hidden',
          top: '-80px',
        }}
      >
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,256L80,229.3C160,203,320,149,480,144C640,139,800,181,960,197.3C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            fill="aliceblue"
          />
        </svg>
      </Box>

      <Container sx={{ paddingY: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          {t('homepage.frequently_asked_questions')} {/* Аударылған мәтін */}
        </Typography>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img
              src={myImage}
              alt="FAQ"
              style={{
                width: '100%',
                borderRadius: '12px',
                objectFit: 'cover',
                boxShadow: '0px 6px 15px rgba(0,0,0,0.15)',
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Item>
              <AccordionGroup variant="outlined" sx={{ borderRadius: '10px' }}>
                {questions.map((item, index) => (
                  <Accordion
                    key={index}
                    variant="soft"
                    sx={{ marginBottom: 1, borderRadius: '8px' }}
                  >
                    <AccordionSummary>{item.q}</AccordionSummary>
                    <AccordionDetails>{item.a}</AccordionDetails>
                  </Accordion>
                ))}
              </AccordionGroup>
            </Item>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default FAQ
