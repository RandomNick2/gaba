import { useState } from 'react'
import {
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  TextField,
} from '@mui/material'
import Header from './Header'

const videos = [
  {
    id: 1,
    title: 'Бурабай - Қазақстанның інжу-маржаны',
    thumbnail: 'https://i.ytimg.com/vi/ZJ2ZCfTmP_4/maxresdefault.jpg',
    description: 'Бурабай ұлттық паркі туралы әсерлі бейне-саяхат.',
    videoUrl: 'https://www.youtube.com/watch?v=ZJ2ZCfTmP_4',
  },
  {
    id: 2,
    title: 'Чарын шатқалы - Қазақстанның Гранд-Каньоны',
    thumbnail: 'https://i.ytimg.com/vi/XyL_v9IgR3o/maxresdefault.jpg',
    description: 'Чарын шатқалының таңғажайып көріністері.',
    videoUrl: 'https://www.youtube.com/watch?v=XyL_v9IgR3o',
  },
  {
    id: 3,
    title: 'Алматы - Қазақстанның мәдени астанасы',
    thumbnail: 'https://i.ytimg.com/vi/Q9K6F2a44SI/maxresdefault.jpg',
    description: 'Алматы қаласының әсем табиғаты мен көрікті жерлері.',
    videoUrl: 'https://www.youtube.com/watch?v=Q9K6F2a44SI',
  },
]

const VideoTravel = () => {
  const [search, setSearch] = useState('')

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header />
      <Container sx={{ py: 5, pt: 14 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Қазақстанның туристік орындарына бейне саяхат
        </Typography>
        <TextField
          label="Іздеу"
          variant="outlined"
          fullWidth
          sx={{ mb: 3, borderRadius: 6 }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Grid container spacing={3}>
          {filteredVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card sx={{ boxShadow: 5, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {video.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    href={video.videoUrl}
                    target="_blank"
                  >
                    Видеоны қарау
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default VideoTravel
