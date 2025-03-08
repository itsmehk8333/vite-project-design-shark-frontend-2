import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to check the current route
import RoutesPage from './Routes/RoutesPage';
import NavbarComponent from './Components/Navbar/NavbarComponent';

function App() {
  const location = useLocation(); // Get the current route path

  // Hide the navbar on /login and /register routes
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {!hideNavbar && <NavbarComponent />} {/* Conditionally render the navbar */}
      <RoutesPage />
    </div>
  );
}

export default App;