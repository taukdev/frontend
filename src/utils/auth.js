// Utility function to decode JWT token and get user information
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log("No token found in localStorage");
    return null;
  }
  
  const decoded = decodeToken(token);
  const role = decoded?.role || null;
  console.log("User role from token:", role);
  return role;
};

// Check if user is masteradmin
export const isMasterAdmin = () => {
  const role = getUserRole();
  const isAdmin = role === 'masteradmin';
  console.log("Is masteradmin check:", isAdmin);
  return isAdmin;
};
