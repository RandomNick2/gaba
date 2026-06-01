import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  IconButton,
  styled,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useParams, useNavigate } from 'react-router-dom'
import api from './../../utils/axios'
import LikeButton from './LikeButton'
import ShareButton from './ShareButton'
import CommentSection from './CommentSection'

// --- Styled Components ---

const PostContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
}))

const PostImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 450,
  objectFit: 'cover',
  [theme.breakpoints.down('md')]: {
    height: 350,
  },
  [theme.breakpoints.down('sm')]: {
    height: 250,
  },
}))

const PostMeta = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}))

const PostContent = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.8,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(4),
  whiteSpace: 'pre-wrap',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}))

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}))

const GoBackButton = styled(IconButton)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.action.active,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}))

// ✅ StyledIconButton анықтамасын қостық
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1), // Батырмалар арасындағы арақашықтық
}))

const SinglePostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'))
  const BASE_URL = 'http://localhost:8000/storage/' // Суреттер үшін BASE_URL

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}`)
        setPost(response.data[0]) // Посттың мәліметтерін '0' кілтінен алыңыз
        setLoading(false)
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Жазбаны жүктеу кезінде қате кетті.')
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const handleGoBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <PostContainer sx={{ textAlign: 'center', py: 10 }}>
        <CircularProgress />
        <Typography mt={2} variant="h6">
          Жазба жүктелуде...
        </Typography>
      </PostContainer>
    )
  }

  if (error) {
    return (
      <PostContainer sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" color="error">
          Қате: {error}
        </Typography>
      </PostContainer>
    )
  }

  if (!post) {
    return (
      <PostContainer sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6">Жазба табылмады.</Typography>
      </PostContainer>
    )
  }

  return (
    <PostContainer maxWidth="md">
      <GoBackButton onClick={handleGoBack} aria-label="go back">
        <ArrowBackIosIcon /> Артқа
      </GoBackButton>

      <PostCard>
        {post.image && (
          <PostImage
            src={`${BASE_URL}${post.image}`}
            alt={post.title || 'Пост суреті'}
          />
        )}
        <CardContent sx={{ p: 4 }}>
          <PostMeta>
            Автор: {post.user?.name || 'Белгісіз'} | Жарияланған күні:{' '}
            {new Date(post.created_at).toLocaleDateString()}
          </PostMeta>
          <PostContent>{post.content}</PostContent>
        </CardContent>

        <PostActions>
          <LikeButton postId={post.id} initialLiked={post.liked_by_user} />
          <StyledIconButton aria-label="bookmark">
            <BookmarkBorderIcon />
          </StyledIconButton>
          <ShareButton shareUrl={`/blog/${post.id}`} shareTitle={post.title} />
        </PostActions>
      </PostCard>

      <Box mt={5}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Пікірлер
        </Typography>
        <CommentSection postId={post?.id} currentUserId={user?.id} />
      </Box>
    </PostContainer>
  )
}

export default SinglePostPage
