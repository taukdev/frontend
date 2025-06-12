import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if there's no token, but save the attempted url
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 