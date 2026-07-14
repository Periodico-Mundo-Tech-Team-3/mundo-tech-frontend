import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { LogIn } from 'lucide-react';
import './Login.scss';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, rellene todos los campos.');
      setIsLoading(false);
      return;
    }

    const response = login(email, password);

    if (response.success) {
      navigate('/my-articles');
    } else {
      setError(response.error || 'Credenciales incorrectas');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card as="form" onSubmit={handleSubmit} className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">Mundo Tech</h1>
          <p className="login-card__subtitle">Back-office editorial</p>
        </div>

        {error && (
          <div className="login-card__error-alert" role="alert">
            {error}
          </div>
        )}

        <div className="login-card__form-group">
          <label htmlFor="email">EMAIL</label>
          <input
            id="email"
            type="email"
            placeholder="nombre@mundotech.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="login-card__form-group">
          <label htmlFor="password">CONTRASEÑA</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="login-card__forgot-container">
          <a href="#forgot" className="login-card__forgot-link">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          icon={LogIn}
          disabled={isLoading}
          className="login-card__submit-btn"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <p className="login-card__footer">
          Acceso exclusivo para el equipo editorial
        </p>
      </Card>
    </div>
  );
};