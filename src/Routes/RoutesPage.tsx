import { Route, Routes } from 'react-router-dom';
import Login from '../Page/Auth/LoginPage';
import Homepage from '../Page/Homepage';
import AdminPage from '../Page/Admin/AdminPage';
import Register from '../Page/Auth/RegisterPage';
import FilesPage from '../Page/FilesPage';
import ProtectedRoute from './ProtectedRoute';

function RoutesPage() {
  return (
    <Routes>
      {/* Public Routes (accessible without token) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (require token) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/allfolders" element={<Homepage />} />
        <Route path="/allfolders/:foldername" element={<FilesPage />} />
      </Route>

      {/* Admin Protected Route with Role Check */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default RoutesPage;