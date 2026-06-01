import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  IconButton,
} from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import api from './../utils/axios'

const EditProfile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('') // Құпия сөзді растау күйі
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken') // 'token' емес, 'authToken' қолданыңыз
        if (!token) {
          setError('Authentication token not found.')
          setLoading(false)
          return
        }
        const response = await api.get('/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userData = response.data
        setName(userData.name || '')
        setEmail(userData.email || '')
        setPhone(userData.phone || '')
        setAvatar(userData.avatar || 'https://via.placeholder.com/150')
        setComments(userData.comments || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setError('Failed to load profile information.')
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatar(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Authentication token not found.')
        return
      }
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (phone) {
        // Телефон нөмірі бар болса ғана қосу
        formData.append('phone', phone)
      }
      if (password) {
        formData.append('password', password)
        formData.append('password_confirmation', passwordConfirmation) // Құпия сөзді растауды қосу
      }
      const avatarFile = document.getElementById('avatar-upload').files[0]
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      await api.post('/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Profile Updated Successfully!')
      // Пайдаланушыны профиль бетіне қайта бағыттау немесе хабар көрсету
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile.')
    }
  }

  if (loading) {
    return (
      <Typography textAlign="center" mt={5}>
        Loading profile information...
      </Typography>
    )
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={5}>
        {error}
      </Typography>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3, mt: 14 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, padding: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            gutterBottom
          >
            Edit Profile
          </Typography>
          <Box textAlign="center" position="relative">
            <Avatar
              src={avatar}
              sx={{ width: 100, height: 100, margin: 'auto' }}
            />
            <input
              accept="image/*"
              type="file"
              id="avatar-upload"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: '40%',
                  bgcolor: 'white',
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {comments.length > 0 && (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Your Comments
            </Typography>
            {comments.map((comment) => (
              <Typography
                key={comment.id}
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {comment.text}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default EditProfile
