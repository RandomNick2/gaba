import React, { useState } from 'react'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  Divider,
  styled,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert

} from '@mui/material'
import { Email, Lock, Person } from '@mui/icons-material'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const API_BASE_URL = 'http://localhost:8000/api'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}))

const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  theme,
  t
}) => (
  <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={onSubmit}>
    <StyledTextField
      fullWidth
      label={t('login_page.email')}
      variant="outlined"
      margin="normal"
      value={email}
      onChange={onEmailChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <StyledTextField
      fullWidth
      label={t('login_page.password')}
      variant="outlined"
      margin="normal"
      type="password"
      value={password}
      onChange={onPasswordChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <StyledButton variant="contained" fullWidth type="submit">
      {t('login_page.login')}
    </StyledButton>
  </Box>
)

const RegisterForm = ({
  fullName,
  email,
  password,
  confirmPassword,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  theme,
  t
}) => (
  <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={onSubmit}>
    <StyledTextField
      fullWidth
      label={t('login_page.full_name')}
      variant="outlined"
      margin="normal"
      value={fullName}
      onChange={onFullNameChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Person sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <StyledTextField
      fullWidth
      label={t('login_page.email')}
      variant="outlined"
      margin="normal"
      value={email}
      onChange={onEmailChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <StyledTextField
      fullWidth
      label={t('login_page.password')}
      variant="outlined"
      margin="normal"
      type="password"
      value={password}
      onChange={onPasswordChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <StyledTextField
      fullWidth
      label={t('login_page.confirm_password')}
      variant="outlined"
      margin="normal"
      type="password"
      value={confirmPassword}
      onChange={onConfirmPasswordChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <StyledButton variant="contained" fullWidth type="submit">
      {t('login_page.register')}
    </StyledButton>
  </Box>
)

const LoginPage = () => {
  const { t, i18n } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerFullName, setRegisterFullName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')
  const theme = useTheme()
  const [errorMessage, setErrorMessage] = useState('');
const [openSnackbar, setOpenSnackbar] = useState(false);

  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: loginEmail,
                password: loginPassword,
            });

            // ✅ ТОКЕНДІ ЖӘНЕ USER ID-ДІ САҚТАУ:
            localStorage.setItem('authToken', response.data.token);

            // ✅ user_id бар екенін тексеру және сақтау
            if (response.data.user_id) {
                localStorage.setItem('userId', response.data.user_id); // Қолданушы ID-ін сақтау
                // Егер user_name, user_email сияқты деректерді де қайтарса, оларды да сақтауға болады
                // localStorage.setItem('userName', response.data.user_name);
            } else {
                console.warn('Login response did not contain user_id. Please check your API response.');
                // Егер userId міндетті болса, бұл жерде қателік хабарламасын көрсетуге болады
            }

            // Логин сәтті болғаннан кейін бас бетке бағыттау
            window.location.href = '/'; // Бұл толық бетті қайта жүктейді
            // Алтернативті: navigate('/') қолданған дұрыс, егер React Router пайдалансаңыз
            // const navigate = useNavigate(); // Компоненттің басында импорттау керек
            // navigate('/');

        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            setErrorMessage(t('login_page.login_failed_credentials')); // Локализацияланған хабарлама
            setOpenSnackbar(true);
        }
    };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    try {
      const csrfResponse = await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      })
      const xsrfToken = csrfResponse.headers['x-xsrf-token']
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        {
          name: registerFullName,
          email: registerEmail,
          password: registerPassword,
          password_confirmation: registerConfirmPassword,
        },
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken,
          },
          withCredentials: true,
        }
      )
      console.log('Success:', response.data)
      alert('Registration successful!')
      setTabIndex(0)
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <StyledPaper>
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: '50%',
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 150,
            height: 150,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3, position: 'relative', zIndex: 1 }}
        >
          <StyledTab label="Кіру" />
          <StyledTab label="Тіркелу" />

        </Tabs>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
              <Select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  disableUnderline
                  sx={{ color: 'black', '& .MuiSelect-icon': { color: 'black' } }}
              >
                  <MenuItem value="kk">ҚАЗ</MenuItem>
                  <MenuItem value="en">ENG</MenuItem>
              </Select>
          </FormControl>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
          >
            {tabIndex === 0 ? t('login_page.welcome_back') : t('login_page.create_account')}
          </Typography>
          {tabIndex === 0 && (
            <LoginForm
              email={loginEmail}
              password={loginPassword}
              onEmailChange={(e) => setLoginEmail(e.target.value)}
              onPasswordChange={(e) => setLoginPassword(e.target.value)}
              onSubmit={handleLoginSubmit}
              theme={theme}
              t={t}
            />
          )}
          {tabIndex === 1 && (
            <RegisterForm
              fullName={registerFullName}
              email={registerEmail}
              password={registerPassword}
              confirmPassword={registerConfirmPassword}
              onFullNameChange={(e) => setRegisterFullName(e.target.value)}
              onEmailChange={(e) => setRegisterEmail(e.target.value)}
              onPasswordChange={(e) => setRegisterPassword(e.target.value)}
              onConfirmPasswordChange={(e) => setRegisterConfirmPassword(e.target.value)}
              onSubmit={handleRegisterSubmit}
              theme={theme}
              t={t}
            />
          )}
        </Box>
        <Divider
          sx={{
            my: 3,
            backgroundColor: theme.palette.divider,
            opacity: 0.5,
            zIndex: 1,
            position: 'relative',
          }}
        />
        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            color: theme.palette.text.secondary,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('login_page.terms_conditions')}
        </Typography>
        <Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
    {errorMessage}
  </Alert>
</Snackbar>

      </StyledPaper>
    </Container>
    
  )
}

export default LoginPage
