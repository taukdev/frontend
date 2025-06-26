import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ResetPassWord from "./components/ResetPassWord";
import DashBoard from "./components/DashBoard";
import Lead from "./components/Lead";
import CollapsibleLead from "./components/CollapsibleLead";
import Sales from "./components/Sales";
import Setting from "./components/Setting";
import Screen2 from './components/ForgotPassWord/Screen2';
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Public Routes Component
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <Navigate to="/Login" replace />
          </PublicRoute>
        } />
        
        <Route path="/Login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/Forgotpassword" element={
          <PublicRoute>
            <ResetPassWord />
          </PublicRoute>
        } />
        
        <Route path="/reset-password" element={
          <PublicRoute>
            <Screen2 />
          </PublicRoute>
        } />

        {/* Private Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <DashBoard />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/Lead" element={
          <PrivateRoute>
            <Layout>
              <Lead />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/CollapsibleLead" element={
          <PrivateRoute>
            <Layout>
              <CollapsibleLead />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/Sales" element={
          <PrivateRoute>
            <Layout>
              <Sales />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/Setting" element={
          <PrivateRoute>
            <Layout>
              <Setting />
            </Layout>
          </PrivateRoute>
        } />

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
