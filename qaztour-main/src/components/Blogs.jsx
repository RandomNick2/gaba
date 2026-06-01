import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material'
import { Link } from 'react-router-dom'

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/posts')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log('API Response in Blogs:', data)
        setBlogs(data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <Container sx={{ paddingY: 14 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ paddingY: 14 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ paddingY: 14 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          padding: 5,
          background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
          color: 'white',
          borderRadius: '10px',
          marginBottom: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Welcome to Our Blog
        </Typography>
        <Typography variant="h6">
          Find inspiration for your next adventure
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <TextField
          label="Search blogs..."
          variant="outlined"
          sx={{ width: '50%' }}
        />
        <Button
          variant="contained"
          sx={{ marginLeft: 2, backgroundColor: '#1976d2', color: 'white' }}
        >
          Search
        </Button>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Link
                to={`/blog/${blog.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {blog.images && blog.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:8000/storage/${blog.images[0].image_path}`}
                    alt={blog.title}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://placehold.co/400"
                    alt={blog.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {blog.content}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Blogs
