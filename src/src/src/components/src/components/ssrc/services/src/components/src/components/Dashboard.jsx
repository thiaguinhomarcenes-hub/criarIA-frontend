import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const usuarioData = JSON.parse(localStorage.getItem('usuario'));
      setUsuario(usuarioData);

      const dashboardData = await usuarioService.getDashboard();
      setDashboard(dashboardData.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      navigate('/login');
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (carregando) return <div className="carregando">Carregando...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>🎬 CriarIA</h1>
        <div className="nav-links">
          <a href="/gerar">Gerar Roteiro</a>
          <a href="/historico">Histórico</a>
          <a href="/perfil">Perfil</a>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Bem-vindo, {usuario?.nome}! 👋</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>📊 Roteiros Gerados</h3>
            <p className="stat-number">{dashboard?.usuario?.total_roteiros || 0}</p>
          </div>

          <div className="stat-card">
            <h3>📅 Este Mês</h3>
            <p className="stat-number">{dashboard?.estatisticas?.roteiros_mes || 0}</p>
          </div>

          <div className="stat-card">
            <h3>💎 Plano</h3>
            <p className="stat-number">{usuario?.plano || 'Iniciante'}</p>
          </div>

          <div className="stat-card">
            <h3>⚡ Status</h3>
            <p className="stat-number">Ativo</p>
          </div>
        </div>

        <div className="recent-section">
          <h3>Últimos Roteiros</h3>
          {dashboard?.estatisticas?.ultimos_roteiros?.length > 0 ? (
            <div className="roteiros-list">
              {dashboard.estatisticas.ultimos_roteiros.map((roteiro) => (
                <div key={roteiro.id} className="roteiro-item">
                  <h4>{roteiro.titulo}</h4>
                  <p>{new Date(roteiro.criado_em).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum roteiro gerado ainda.</p>
          )}
        </div>

        <div className="cta-section">
          <button className="btn-primary" onClick={() => navigate('/gerar')}>
            ✨ Gerar Novo Roteiro
          </button>
        </div>
      </div>
    </div>
  );
}
