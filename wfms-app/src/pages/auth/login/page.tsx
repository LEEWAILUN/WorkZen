import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../auth.css';
import Header from '../../../components/navigation/header/navigation';
import Footer from '../../../components/navigation/footer/navigation';
import GoogleLoginButton from '../../../components/buttons/Google/SignIn/button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const validateInputs = () => {
    const emailValid = /\S+@\S+\.\S+/.test(email);
    const passwordValid = password.length >= 8; 

    setErrors({
      email: !emailValid,
      password: !passwordValid,
    });

    return emailValid && passwordValid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      console.log('Logging in with:', { email, password });
    }
  };

  return (
    <div className="auth-page">
      <Header />

      <div className="auth-wrapper">
        <div className="auth-column auth-column-left">
        </div>

        <div className="auth-column auth-column-middle">
          <div className="auth-box">
            <h2 className="welcome-message">Welcome Back!</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group input-with-icon">
                <label htmlFor="auth-email">Email:</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope icon"></i>
                  <input
                    type="email"
                    id="auth-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className={errors.email ? 'input-error' : ''}
                  />
                </div>
                {errors.email && <p className="error-message">Invalid email format</p>}
              </div>

              <div className="form-group input-with-icon">
                <label htmlFor="auth-password">Password:</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className={errors.password ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                  </button>
                </div>
                {errors.password && <p className="error-message">Password must be at least 6 characters</p>}
              </div>

              <button type="submit" className="btn auth-btn">
                LOGIN
              </button>

              <div className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="google-btn">
              <GoogleLoginButton />
            </div>

            <div className="auth-link">
              <p>
                Don't have an account? <Link to="/auth/register">Get Started Now!</Link>
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

export default LoginPage;
