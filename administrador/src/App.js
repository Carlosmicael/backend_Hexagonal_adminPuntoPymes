import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import MainLayout from './componentes/layouts/mainLayout.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';




const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Verificando autenticación...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return element; 
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />


          <Route path="/" element={<ProtectedRoute element={<MainLayout />} />}>

             <Route path="/dashboard" element={<DashboardPage />} />

          </Route>
          
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
