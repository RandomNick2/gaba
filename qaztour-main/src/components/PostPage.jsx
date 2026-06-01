import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material'

function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP қателігі: ${response.status}`)
        }
        const data = await response.json()
        console.log('API Response in PostPage:', data)
        setPost(data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <Container sx={{ paddingY: 4 }}>
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
      <Container sx={{ paddingY: 4 }}>
        <Typography variant="h6" color="error">
          Қателік: {error}
        </Typography>
      </Container>
    )
  }

  if (!post) {
    return (
      <Container sx={{ paddingY: 4 }}>
        <Typography variant="h6">Post not found.</Typography>
      </Container>
    )
  }

  console.log('Post state in PostPage:', post)

  return (
    <Container sx={{ paddingY: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="400"
          image={post?.image} // Қауіпсіздік үшін optional chaining
          alt={post?.title} // Қауіпсіздік үшін optional chaining
        />
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            {post?.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Published on{' '}
            {post?.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : 'N/A'}
          </Typography>
          <Typography variant="body1">{post?.content}</Typography>
          {/* Басқа да пост контентін қосуға болады */}
        </CardContent>
      </Card>
    </Container>
  )
}

export default PostPage
