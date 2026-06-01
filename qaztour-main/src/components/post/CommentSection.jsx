import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress, // Загрузка үшін қосылды
  Avatar,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const API_BASE_URL = 'http://127.0.0.1:8000/api/comments' // BASE_URL-ді анықтау

const CommentSection = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(true) // Пікірлерді жүктеу күйі
  const [submittingComment, setSubmittingComment] = useState(false) // Пікірді жіберу күйі
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)

  // Пікірлерді жүктеу
  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      // API-ге post_id бойынша фильтрлеу сұрауын жіберу
      const res = await axios.get(`${API_BASE_URL}?post_id=${postId}`)
      // API жауабының құрылымын тексеріңіз. Әдетте, деректер data.data ішінде болады.
      setComments(res.data.data || res.data) // Егер res.data.data болмаса, res.data қолданамыз
    } catch (error) {
      console.error('Пікірлерді жүктеу қатесі:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => {
    if (postId) {
      // postId бар болса ғана пікірлерді жүктеу
      fetchComments()
    }
  }, [postId]) // postId өзгергенде қайта жүктеу

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return // Бос пікірге жол бермеу

    setSubmittingComment(true)
    try {
      const authToken = localStorage.getItem('authToken') // Токенді алу
      let token = authToken
      // Егер токен JSON жолы ретінде сақталса, оны парсылдау керек.
      // Бірақ ең дұрысы, токенді тікелей жол ретінде сақтау.
      // Мысалы, response.data.token тікелей "eyJ..." болса:
      // token = authToken;
      // Егер response.data.token = { token: "eyJ..." } сияқты объект болса:
      // try { token = JSON.parse(authToken).token; } catch (e) { console.error("Токен парсылдау қатесі:", e); }

      // AuthToken-ді қалай сақтағаныңызға байланысты `token = authToken;` немесе `token = JSON.parse(authToken).token;` таңдаңыз
      // Ең ықтималы, сіз `localStorage.setItem('authToken', response.data.token)` деп сақтағансыз, сондықтан `token = authToken;` дұрыс.
      // Мен алдыңғы жауаптарда `localStorage.setItem('authToken', response.data.token)` деген болғандықтан, `JSON.parse` қажет емес деп болжаймын.
      // Егер ол қате болса, `JSON.parse` қосуға тура келеді.
      // Қазіргі уақытта `localStorage.getItem('authToken')` тікелей токенді береді деп болжайық.

      const response = await axios.post(
        API_BASE_URL, // Толық URL пайдалану
        {
          content: newComment,
          post_id: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Токенді жіберу
            'Content-Type': 'application/json',
          },
        }
      )
      setNewComment('')
      fetchComments() // Пікірлерді жаңарту
      console.log('Пікір сәтті жіберілді:', response.data)
    } catch (error) {
      console.error('Пікір жіберу қатесі:', error)
      // Қатенің толық мәтінін көрсету
      alert(
        `Пікір жіберу қатесі: ${error.response?.data?.message || error.message}`
      )
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDelete = async (commentId) => {
    setDeleteLoadingId(commentId)
    try {
      const authToken = localStorage.getItem('authToken')
      let token = authToken // Токенді алу
      // Осы жерде де токенді парсылдау қажет болса, қосыңыз

      await axios.delete(`${API_BASE_URL}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchComments() // Пікірлерді жаңарту
      console.log('Пікір сәтті жойылды.')
    } catch (error) {
      console.error('Пікірді жою қатесі:', error)
      alert(
        `Пікірді жою қатесі: ${error.response?.data?.message || error.message}`
      )
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <Box mt={4}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Пікір жазыңыз..."
          multiline
          fullWidth
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={submittingComment} // Жіберу кезінде өшіру
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={submittingComment} // Жіберу кезінде өшіру
        >
          {submittingComment ? <CircularProgress size={24} /> : 'Жіберу'}
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Пікірлер
        </Typography>
        {loadingComments ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={100}
          >
            <CircularProgress />
          </Box>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} sx={{ mb: 2, p: 2, boxShadow: 1 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  {/* Аватар көрсету (егер comment.user дерегінде avatar жолы болса) */}
                  {comment.user?.avatar && (
                    <Avatar
                      src={`http://127.0.0.1:8000${comment.user.avatar}`}
                      sx={{ width: 30, height: 30, mr: 1 }}
                    />
                  )}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {comment.user?.name || 'Аноним'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 'auto' }}
                  >
                    {new Date(comment.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
                {comment.user_id === currentUserId && ( // Пайдаланушы өз пікірін ғана жоя алады
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleteLoadingId === comment.id}
                    sx={{ mt: 1 }}
                  >
                    {comment.user_id === currentUserId && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteLoadingId === comment.id}
                        aria-label="delete"
                      >
                        {deleteLoadingId === comment.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Әлі пікірлер жоқ. Алғашқы болып пікір қалдырыңыз!
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default CommentSection
