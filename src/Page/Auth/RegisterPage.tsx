import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import loptop02 from "../../assets/download.jpeg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Styled components
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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User', // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://design-shark-backend-4-4.onrender.com/api/auth/register", formData);
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed. Please try again.");
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
      </LaptopBox>

      {/* Register Form */}
      <FormContainer maxWidth={false}>
        <FormPaper elevation={0}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
            DEZIGN SHARK<sup style={{ fontSize: '0.5em' }}>®</sup>
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: '#ccc', fontSize: '0.9em', letterSpacing: 5 }}>
            ALL ABOUT DESIGN
          </Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ color: '#bbb', fontSize: '1.5em', mt: 1 }}>
            Create an Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
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
              Register
            </Button>
          </form>
        </FormPaper>
      </FormContainer>
    </BackgroundBox>
  );
};

export default Register;
