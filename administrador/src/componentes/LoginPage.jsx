import React, { useState } from 'react';
import './LoginPage.css';
import loginImage from './images/login-image.png'; 
import logo from './images/logo2.png'; 

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      {/* Columna izquierda - formulario */}
      <div className="login-left">
        <div className="login-content">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="text-center mt-3">Login</h2>
          <p className="text-center mb-4 text-muted">Bienvenido Administrador</p>

          <form>
            <div className="form-group mb-3">
              <label>Usuario</label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={togglePassword}
                  role="button"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <div className="text-end mb-3">
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn-login">Login</button>
          </form>

          <p className="text-center mt-4">
            Don’t have an account? <a href="#" className="signup-link">Sign up</a>
          </p>
        </div>
      </div>

      {/* Columna derecha - imagen */}
      <div className="login-right">
        <img src={loginImage} alt="Login visual" className="login-image" />
      </div>
    </div>
  );
}

export default LoginPage;
