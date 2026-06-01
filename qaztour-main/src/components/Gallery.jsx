import React, { useEffect, useState } from 'react'
import { Container, CircularProgress, Typography, Box } from '@mui/material'
import Masonry from 'react-masonry-css'
import { motion } from 'framer-motion'

const API_KEY = '49304988-8726c681c45c6556de8e3d9a3'
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=nature&image_type=photo&per_page=12`

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setImages(data.hits)
        setLoading(false)
      })
      .catch((error) => console.error('Error fetching images:', error))
  }, [])

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  }

  return (
    <Container sx={{ mt: 14, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#000',
          textShadow: '2px 2px 10px rgba(252, 252, 252, 0.4)',
        }}
      >
        🌿 Kazakhstan Nature Gallery
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                component="img"
                src={image.webformatURL}
                alt={image.tags}
                sx={{ width: '100%', borderRadius: '12px' }}
              />
            </motion.div>
          ))}
        </Masonry>
      )}
    </Container>
  )
}

export default Gallery
