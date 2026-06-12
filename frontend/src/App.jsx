import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Plan from './pages/Plan';
import Wellness from './pages/Wellness';
import Finance from './pages/Finance';
import Mindset from './pages/Mindset';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Community from './pages/Community';
import ConnectionMap from './pages/Map';
import Store from './pages/Store';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-bg-main flex items-center justify-center font-heading text-2xl text-primary animate-pulse">Loading Rise & Structure...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/store" element={<Store />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard/progress" element={<Progress />} />
            <Route path="/dashboard/plan" element={<Plan />} />
            <Route path="/dashboard/wellness" element={<Wellness />} />
            <Route path="/dashboard/finance" element={<Finance />} />
            <Route path="/dashboard/mindset" element={<Mindset />} />
            <Route path="/dashboard/community" element={<Community />} />
            <Route path="/dashboard/map" element={<ConnectionMap />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
