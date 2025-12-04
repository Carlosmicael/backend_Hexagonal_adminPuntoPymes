import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/images/logo2.png';
import loginImage from '../../assets/images/login-image.png';
import './LoginPage.css';

function LoginPage() {
  const { login, isAuthenticated, loading: authLoading,user } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({usuario: '', password: '',});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);


  useEffect(() => {
  if (!authLoading && isAuthenticated) {
    console.log( "user",user);
    if (user.role === "admin") {
      navigate('/dashboard', { replace: true });
    } else if (user.role === "manager") {
      navigate('/manager/home', { replace: true });
    } else {
      navigate('/dashboard');
    }
  }
}, [authLoading, isAuthenticated, user, navigate]);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePassword = () => {
    setPasswordVisible((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.usuario, formData.password);
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('Credenciales inválidas. Por favor verifica usuario y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="center-screen">Verificando sesión...</div>;
  }

  return (
    <div className="login-container">
      {/* Columna izquierda - formulario */}
      <div className="login-left">
        <div className="login-content">
          <img src={logo} alt="Logo de la Aplicación" className="login-logo" />
          <h2 className="text-center mb-4">Iniciar Sesión</h2>

          {error && <div className="alert-error text-danger text-center mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                placeholder="Ingresa tu usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password btn btn-sm"
                  onClick={togglePassword}
                  aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {passwordVisible ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="text-end mb-3">
              {/* Usar button en vez de <a href="#"> para accesibilidad */}
              <button type="button" className="forgot-password btn btn-link p-0">
                ¿Olvidaste la contraseña?
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center mt-3">
            ¿No tienes cuenta?{' '}
            <button type="button" className="signup-link btn btn-link p-0">
              Regístrate
            </button>
          </p>
        </div>
      </div>

      {/* Columna derecha - Imagen */}
      <div className="login-right">
        <img src={loginImage} alt="Fondo de Login" className="login-image" />
      </div>
    </div>
  );
}

export default LoginPage;
