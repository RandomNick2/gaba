import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Link as MuiLink,
  styled,
  useTheme,
  Box,
} from '@mui/material'
import { Link } from 'react-router-dom'
import LikeButton from './LikeButton'
import ShareButton from './ShareButton'
import VisibilityIcon from '@mui/icons-material/Visibility' // 'Толығырақ' батырмасы үшін

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2), // Дөңгелектелген шеттер
  boxShadow: theme.shadows[6], // Көбірек көлеңке
  overflow: 'hidden', // Мазмұнның шеттен шығып кетпеуі үшін
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)', // Үстіне апарғанда аздап көтерілу
    boxShadow: theme.shadows[12], // Тереңірек көлеңке
  },
}))

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  // Фон түсін және мәтін түсін темадан алу
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[50]
      : theme.palette.grey[900],
  color: theme.palette.text.primary,
  paddingBottom: theme.spacing(1), // Ішкі бос орын
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  // Аватардың фонын және мәтін түсін темадан алу
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}))

const PostContent = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
}))

const StyledLinkButton = styled(MuiLink)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightMedium,
  '&:hover': {
    textDecoration: 'underline',
    color: theme.palette.primary.dark,
  },
}))

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800],
  display: 'flex',
  justifyContent: 'space-between', // Элементтерді екі шетке жаю
  alignItems: 'center',
}))

const PostCard = ({ post }) => {
  const theme = useTheme()

  return (
    <StyledCard>
      <StyledCardHeader
        avatar={
          <StyledAvatar aria-label="author">
            {post.user?.name?.charAt(0).toUpperCase() || 'А'}
          </StyledAvatar>
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold">
            {post.user?.name || 'Белгісіз автор'}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {new Date(post.created_at).toLocaleDateString()}
          </Typography>
        }
      />

      <CardContent>
        <PostContent>
          {post.content?.substring(0, 150)}... {/* Сипаттаманы қысқарту */}
          <StyledLinkButton component={Link} to={`/blog/${post.id}`}>
            <VisibilityIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> Толығырақ
          </StyledLinkButton>
        </PostContent>
      </CardContent>

      <StyledCardActions disableSpacing>
        <Box display="flex" alignItems="center">
          <LikeButton postId={post.id} initialLiked={post.liked_by_user} />
          {/* Bookmark батырмасы (қажет болса) */}
          {/* <StyledIconButton aria-label="bookmark">
            <BookmarkBorderIcon />
          </StyledIconButton> */}
        </Box>
        <ShareButton shareUrl={`/blog/${post.id}`} shareTitle={post.title} />
      </StyledCardActions>
    </StyledCard>
  )
}

export default PostCard
