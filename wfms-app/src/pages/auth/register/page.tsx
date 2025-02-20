import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../auth.css';
import Header from '../../../components/navigation/header/navigation';
import Footer from '../../../components/navigation/footer/navigation';
import GoogleLoginButton from '../../../components/buttons/Google/SignUp/button';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    console.log('Registering with:', { username, email, password });
  };

  return (
    <div className="auth-page">
      <Header />

      <div className="auth-wrapper">
        <div className="auth-column auth-column-left">
        </div>

        <div className="auth-column auth-column-middle">
          <div className="auth-box">
            <h2 className="welcome-message">Let's Get Started!</h2>
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="register-username">Username:</label>
                <div className="input-with-icon">
                  <div className="input-wrapper">
                    <i className="fas fa-user icon"></i>
                    <input
                      type="text"
                      id="register-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Example: Lee Wai Lun"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email:</label>
                <div className="input-with-icon">
                  <div className="input-wrapper">
                    <i className="fas fa-envelope icon"></i>
                    <input
                      type="email"
                      id="register-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Example: 2103328@1utar.my"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password:</label>
                <div className="input-with-icon">
                  <div className="input-wrapper">
                    <i className="fas fa-lock icon"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <button type="submit" className="auth-btn">REGISTER</button>
                <div className="divider">
                  <span>OR</span>
                </div>
                <div className="google-btn">
                  <GoogleLoginButton />
                </div>
              </div>
            </form>

            <div className="auth-link">
              <p>
                Already have an account?{' '}  
                <Link to="/auth/login">Login here!</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-column auth-column-right"></div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
