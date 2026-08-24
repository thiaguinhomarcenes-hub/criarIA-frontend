import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await authService.login(email, senha);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🎬 CriarIA</h1>
        <h2>Faça Login</h2>

        {erro && <div className="erro">{erro}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" disabled={carregando}>
            {carregando ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <p>
          Não tem conta? <a href="/cadastro">Cadastre-se aqui</a>
        </p>
      </div>
    </div>
  );
}
