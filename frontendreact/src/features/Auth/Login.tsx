import React, { useState, useEffect, FormEvent, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './style.css';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container } from "@tsparticles/engine";

// Componente separado para as partículas
const ParticlesBackground = React.memo(() => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // opcional: console.log('Particles Loaded:', container);
  };

  const options = useMemo(() => ({
    background: {
      color: '#6868bb',
    },
    fpsLimit: 60,
    particles: {
      number: { value: 120, density: { enable: false } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 3 },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none" as const,
        random: false,
        straight: false,
        outModes: { default: "out" as const },
        attract: { enable: false }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { quantity: 4 }
      }
    },
    detectRetina: true
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      particlesLoaded={particlesLoaded}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
    />
  );
});

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'recovery' | 'confirmation'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    document.body.classList.add('login-bg');
    return () => {
      document.body.classList.remove('login-bg');
    };
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, senha);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  const handleRecovery = (e: FormEvent) => {
    e.preventDefault();
    setView('confirmation');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ParticlesBackground />
      <div className="auth-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="auth-box">
          <div className="logo-center">
            <div className="login-logo-icon-big">
              <i className="fa fa-truck"></i>
            </div>
          </div>
          <div className={`form-view${view === 'login' ? ' active' : ''}`}> 
            <h4 className="text-center" style={{ fontWeight: 600, color: '#2f4cdd' }}>Bem-vindo ao TrackFleet</h4>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <i className="fa fa-user"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <i className="fa fa-lock"></i>
                <input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="mb-0" style={{ fontWeight: 'normal' }}>
                  <input type="checkbox" checked={lembrar} onChange={e => setLembrar(e.target.checked)} /> Lembrar-me
                </label>
                <span className="toggle-link" onClick={() => setView('recovery')}>Esqueceu a senha?</span>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Entrar</button>
            </form>
          </div>
          <div className={`form-view${view === 'recovery' ? ' active' : ''}`}> 
            <h4 className="text-center" style={{ fontWeight: 600, color: '#2f4cdd' }}>Recuperar Senha</h4>
            <form onSubmit={handleRecovery}>
              <div className="form-group">
                <i className="fa fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning btn-block">Enviar recuperação</button>
            </form>
            <div className="text-center mt-4">
              <span>Lembrou a senha? <span className="toggle-link" onClick={() => setView('login')}>Entrar</span></span>
            </div>
          </div>
          <div className={`form-view${view === 'confirmation' ? ' active' : ''}`}> 
            <h4 className="text-center text-success" style={{ fontWeight: 600 }}>Solicitação enviada!</h4>
            <p className="text-center mt-3">
              Enviamos um link de recuperação para o e-mail informado.<br />
              Verifique sua caixa de entrada (e também a pasta de spam).
            </p>
            <div className="text-center mt-4">
              <button className="btn btn-primary btn-block" onClick={() => setView('login')}>Voltar ao Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 