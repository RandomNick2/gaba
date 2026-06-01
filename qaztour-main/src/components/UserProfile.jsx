import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Container,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AddIcon from '@mui/icons-material/Add';
import { NavLink, Link } from 'react-router-dom';
import api from './../utils/axios'; // Сіздің axios инстансыңыз
import { useTranslation } from 'react-i18next'; // ✅ useTranslation импорты

const BASE_URL = 'http://127.0.0.1:8000'; // Негізгі URL, аватар үшін storage/ жолы қосылады

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const { t, i18n } = useTranslation(); // ✅ i18n объектісін аламыз

  // Хабарламаларды көрсету үшін (Snackbar пайдаланбағандықтан alert қолданамыз)
  const showAlert = (message) => {
    // Сізде Snackbаr жоқ болғандықтан, alert қолданамыз
    alert(message);
  };

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error(t('user_profile.auth_token_not_found_console'));
        return;
      }
      const response = await api.get('/user/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserReviews(response.data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setError(t('user_profile.failed_to_load_reviews'));
    }
  };

  useEffect(() => {
    const fetchUserProfileAndReviews = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError(t('user_profile.auth_token_not_found_login'));
          setLoading(false);
          return;
        }
        const userResponse = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User Data:', userResponse.data);
        setUser(userResponse.data);

        // Броньдарды жүктеу
        const bookingsResponse = await api.get('/bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Bookings Data:', bookingsResponse.data);
        setBookings(bookingsResponse.data.bookings || []); // bookings null болмауын қамтамасыз ету

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile data:', err);
        setError(t('user_profile.failed_to_load_profile_info'));
        setLoading(false);
      }
      await fetchUserReviews(); // Пікірлерді жүктеу
    };

    fetchUserProfileAndReviews();
  }, [t, i18n.language]); // ✅ 't' және 'i18n.language' тәуелділікке қосу

  const handleDeleteReview = async (reviewId) => {
    setDeleteLoading(reviewId);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error(t('user_profile.auth_token_not_found_console'));
        return;
      }
      await api.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserReviews(userReviews.filter((review) => review.id !== reviewId));
      showAlert(t('user_profile.review_deleted_success'));
    } catch (error) {
      console.error('Error deleting review:', error);
      showAlert(t('user_profile.error_deleting_review'));
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeletePost = async (postId) => {
    setDeleteLoading(postId);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error(t('user_profile.auth_token_not_found_console'));
        return;
      }
      await api.delete(`/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((prevUser) => ({
        ...prevUser,
        posts: prevUser.posts.filter((post) => post.id !== postId),
      }));
      showAlert(t('user_profile.post_deleted_success'));
    } catch (error) {
      console.error('Error deleting post:', error);
      showAlert(t('user_profile.error_deleting_post'));
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditedContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditedContent('');
  };

  const handleSaveEdit = async (postId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error(t('user_profile.auth_token_not_found_console'));
        return;
      }
      const response = await api.put(
          `/post/${postId}`,
          { content: editedContent },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setUser((prevUser) => ({
        ...prevUser,
        posts: prevUser.posts.map((post) =>
            post.id === postId
                ? { ...post, content: response.data.post.content }
                : post
        ),
      }));
      setEditingPostId(null);
      setEditedContent('');
      showAlert(t('user_profile.post_updated_success'));
    } catch (error) {
      console.error('Error updating post:', error);
      showAlert(t('user_profile.error_updating_post'));
    }
  };

  // API-да name_kk, description_kk сияқты кілттер жоқ, сондықтан i18n.language 'kk' болса, 'kz' деп өңдейміз
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  // --- ШАРТТЫ РЕНДЕРЛЕУ (CONDITIONAL RENDERING) ---
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
    );
  }

  if (error) {
    return (
        <Typography color="error" textAlign="center" mt={5}>
          {error}
        </Typography>
    );
  }

  if (!user) {
    return (
        <Typography textAlign="center" mt={5}>
          {t('user_profile.no_user_data_available')}
        </Typography>
    );
  }

  // console.log('Bookings state before render:', bookings); // Дебаг үшін

  return (
      <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3, mt: 14 }}>
        {/* Профиль картасы */}
        <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              padding: 3,
              textAlign: 'center',
              mb: 3,
            }}
        >
          <Avatar
              src={`${BASE_URL}${user.avatar}`}
              sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
          />
          <Typography variant="h5" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('user_profile.role')}: {user.role || t('user_profile.not_specified')} {/* ✅ Рольді локализациялау */}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
                component={NavLink}
                to="/my-bookings"
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2 }}
            >
              {t('user_profile.bookmarked_hotels')}
            </Button>
            <Button
                component={NavLink}
                to="/edit-profile"
                startIcon={<EditIcon />}
                variant="outlined"
                sx={{ borderRadius: 2 }}
            >
              {t('user_profile.edit_profile')}
            </Button>
            <Button
                component={NavLink}
                to="/blog-create"
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2 }}
            >
              {t('user_profile.new_post')}
            </Button>
          </Box>
          {/* Әлеуметтік желі иконкалары */}
          <Box sx={{ mt: 2 }}>
            {user.facebook_url && (
                <IconButton
                    href={user.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  <FacebookIcon color="primary" />
                </IconButton>
            )}
            {user.instagram_url && (
                <IconButton
                    href={user.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  <InstagramIcon color="secondary" />
                </IconButton>
            )}
            {user.twitter_url && (
                <IconButton
                    href={user.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  <TwitterIcon color="primary" />
                </IconButton>
            )}
          </Box>
        </Card>
        {/* Жазбалар */}
        {user.posts && user.posts.length > 0 && (
            <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t('user_profile.your_posts')}
                </Typography>
                {user.posts.map((post) => (
                    <Box
                        key={post.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          borderBottom: '1px solid #eee',
                          pb: 1,
                        }}
                    >
                      {editingPostId === post.id ? (
                          <TextField
                              fullWidth
                              multiline
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              variant="outlined"
                              size="small"
                              sx={{ flexGrow: 1, mr: 1 }}
                          />
                      ) : (
                          <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ flexGrow: 1 }}
                          >
                            {post.content || t('user_profile.no_content')}
                          </Typography>
                      )}
                      {editingPostId === post.id ? (
                          <Box>
                            <Button
                                onClick={() => handleSaveEdit(post.id)}
                                color="primary"
                                size="small"
                            >
                              {t('user_profile.save_button')}
                            </Button>
                            <Button onClick={handleCancelEdit} size="small">
                              {t('user_profile.cancel_button')}
                            </Button>
                          </Box>
                      ) : (
                          <Box>
                            <IconButton
                                onClick={() => handleEditPost(post)}
                                aria-label="edit"
                                size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleDeletePost(post.id)}
                                disabled={deleteLoading === post.id}
                                aria-label="delete"
                                color="error"
                                size="small"
                            >
                              {deleteLoading === post.id ? (
                                  <Typography variant="caption">{t('user_profile.deleting')}...</Typography> /* ✅ Локализация */
                              ) : (
                                  <DeleteIcon />
                              )}
                            </IconButton>
                          </Box>
                      )}
                    </Box>
                ))}
              </CardContent>
            </Card>
        )}
        {/* Пікірлер */}
        {userReviews.length > 0 && (
            <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t('user_profile.your_reviews')}
                </Typography>
                {userReviews.map((review) => (
                    <Box
                        key={review.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          borderBottom: '1px solid #eee',
                          pb: 1,
                        }}
                    >
                      <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ flexGrow: 1 }}
                      >
                        {review.content} ({t('user_profile.rating')}: {review.rating})
                      </Typography>
                      <IconButton
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deleteLoading === review.id}
                          aria-label="delete"
                          color="error"
                      >
                        {deleteLoading === review.id ? (
                            <Typography variant="caption">{t('user_profile.deleting')}...</Typography> /* ✅ Локализация */
                        ) : (
                            <DeleteIcon />
                        )}
                      </IconButton>
                    </Box>
                ))}
              </CardContent>
            </Card>
        )}
        {/* Турлар */}
        {user.tours && user.tours.length > 0 && (
            <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t('user_profile.your_tours')}
                </Typography>
                {user.tours.map((tour) => (
                    <Box
                        key={tour.id}
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      <Link
                          to={`/tour/${tour.id}`}
                          style={{ textDecoration: 'none' }}
                      >
                        <Typography>{tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('user_profile.no_name')}</Typography> {/* ✅ Тур атауын локализациялау */}
                      </Link>
                      <Typography sx={{ ml: 2 }}>
                        ({t('user_profile.price')}: {tour.price || 'N/A'}) {/* ✅ Бағаны локализациялау */}
                      </Typography>
                    </Box>
                ))}
              </CardContent>
            </Card>
        )}

        {/* Броньдар */}
        {bookings && bookings.length > 0 && (
            <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t('user_profile.your_bookings')}

                </Typography>
                {bookings.map((booking) => (
                    <Typography key={booking.id} sx={{ mt: 1 }}>
                      {/* Бронь ақпаратын локализациялау */}
                      {booking.hotel?.name || booking.tour?.name || t('user_profile.no_name')}{' '} -{' '}
                      {t('user_profile.check_in')}: {new Date(booking.check_in_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')} -{' '}
                      {t('user_profile.check_out')}: {new Date(booking.check_out_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}{' '}
                      ({t('user_profile.status')}: {t(`booking_room.status_${booking.status}`)}) {/* ✅ Статусты BookingRoom-нан аудару */}
                    </Typography>
                ))}
              </CardContent>
            </Card>
        )}

        {/* Сақталған турлар */}
        {user.favorite_tours && user.favorite_tours.length > 0 && (
            <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t('user_profile.your_favorite_tours')}
                </Typography>
                {user.favorite_tours.map((favorite) => (
                    <Typography
                        key={favorite.id}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                      {/* favorite.name-ді де локализациялау (API-да name_kz/en болса) */}
                      {favorite[`name_${effectiveLang}`] || favorite.name_kz || favorite.name_en || t('user_profile.no_name')}
                    </Typography>
                ))}
              </CardContent>
            </Card>
        )}
      </Box>
  );
};

export default UserProfile;