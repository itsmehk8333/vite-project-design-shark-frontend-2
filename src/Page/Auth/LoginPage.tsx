import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import loptop02 from '../../assets/download.jpeg';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveToken } from '../../Auth/auth';

// Custom styled components
const BackgroundBox = styled(Box)({
  backgroundColor: '#000',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
});

const LaptopBox = styled(Box)({
  position: 'absolute',
  top: '10%',
  left: '5%',
  width: '40%',
  transform: 'rotate(-10deg)',
});

const FormContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  minHeight: '100vh',
  padding: 0,
});

const FormPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '10px',
  backgroundColor: '#2c2c2c',
  color: '#fff',
  width: '400px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added for error handling

  const navigate = useNavigate();
  const location = useLocation(); // Get the location to handle redirect state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null); // Clear error message when user starts typing
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear any previous errors

    try {
      const response = await axios.post('https://design-shark-backend-4-5.onrender.com/api/auth/login', formData);
      if (response.status === 200) {
        const { token, data: userData } = response.data; // Assuming backend returns { token, data: { role, ... } }
        saveToken(token); // Save the token using the provided auth utility
        localStorage.setItem('role', userData.role); // Store the role in localStorage

        // Determine redirect based on role
        const redirectPath = userData.role.toLowerCase() === 'admin' ? '/admin' : '/allfolders';

        // Get the original path the user was trying to access (from ProtectedRoute state)
        const from = location.state?.from?.pathname || redirectPath;

        navigate(from, { replace: true }); // Redirect to the intended page or default
        console.log(response, 'Login successful');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Display specific error from backend
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <BackgroundBox>
      <LaptopBox>
        <Box
          component="img"
          src={loptop02}
          alt="Laptop"
          sx={{ border: '5px solid #ff5722', borderRadius: '10px', width: '100%' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '-20px',
            left: '50px',
            width: '50px',
            height: '50px',
            backgroundColor: '#ff9800',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '100px',
            left: '150px',
            width: '60px',
            height: '60px',
            backgroundColor: '#4caf50',
            transform: 'rotate(45deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '200px',
            left: '100px',
            width: '70px',
            height: '70px',
            backgroundColor: '#ffca28',
            transform: 'rotate(-30deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-50px',
            left: '50px',
            width: '200px',
            height: '50px',
            backgroundColor: '#ff5722',
            borderRadius: '10px',
            transform: 'rotate(15deg)',
          }}
        />
      </LaptopBox>

      <FormContainer maxWidth={false}>
        <FormPaper elevation={0}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
            DEZIGN SHARK<sup style={{ fontSize: '0.5em' }}>®</sup>
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: '#ccc', fontSize: '0.9em', marginTop: '-10px', letterSpacing: 5 }}>
            ALL ABOUT DESIGN
          </Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ color: '#bbb', fontSize: '1.5em', mt: 1, textAlign: 'start' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" gutterBottom sx={{ color: '#999', mb: 2, textAlign: 'start', marginTop: '-10px' }}>
            Please enter your login details to continue
          </Typography>

          {errorMessage && (
            <Typography variant="body2" align="center" sx={{ color: '#ff0000', mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff', borderColor: '#444' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#ff5722' },
                },
                input: { color: '#fff' },
                label: { color: '#ccc' },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', borderColor: '#444' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#ccc' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#ff5722' },
                },
                input: { color: '#fff' },
                label: { color: '#ccc' },
              }}
            />
            <Typography variant="body2" align="right" sx={{ color: '#ff5722', mt: 1, mb: 2 }}>
              <a href="#" style={{ color: '#ff5722', textDecoration: 'none' }}>Forgot password?</a>
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: '#ff0000',
                color: '#fff',
                '&:hover': { backgroundColor: '#cc0000' },
                borderRadius: '5px',
                padding: '10px 0',
                textTransform: 'none',
                fontSize: '1.1em',
                fontWeight: 'bold',
              }}
            >
              Login
            </Button>
          </form>
        </FormPaper>
      </FormContainer>
    </BackgroundBox>
  );
};

export default Login;