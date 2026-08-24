import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roteirosService } from '../services/api';
import './Gerar.css';

export default function Gerar() {
  const [tema, setTema] = useState('');
  const [nicho, setNicho] = useState('');
  const [tom, setTom] = useState('engajante');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [roteiro, setRoteiro] = useState(null);
  const navigate = useNavigate();

  const handleGerarRoteiro = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setSucesso('');

    try {
      const response = await roteirosService.gerar(tema, nicho, tom);
      setRoteiro(response.data.roteiro);
      setSucesso('✅ Roteiro gerado com sucesso!');
      setTema('');
      setNicho('');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao gerar roteiro');
    } finally {
      setCarregando(false);
    }
  };

  const handleGerarImagem = async () => {
    if (!roteiro) return;

    setCarregando(true);
    setErro('');

    try {
      const response = await roteirosService.gerarImagem(roteiro.conteudo, 'moderno e profissional');
      setRoteiro({
        ...roteiro,
        imagem_url: response.data.imagem.url,
      });
      setSucesso('✅ Imagem gerada com sucesso!');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao gerar imagem');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="gerar-container">
      <nav className="navbar">
        <h1>🎬 CriarIA</h1>
        <a href="/dashboard">← Voltar</a>
      </nav>

      <div className="gerar-content">
        <h2>Gerar Novo Roteiro ✨</h2>

        {erro && <div className="erro">{erro}</div>}
        {sucesso && <div className="sucesso">{sucesso}</div>}

        <form onSubmit={handleGerarRoteiro} className="gerar-form">
          <div className="form-group">
            <label>Tema do Roteiro</label>
            <input
              type="text"
              placeholder="Ex: Como crescer no Instagram"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nicho</label>
            <input
              type="text"
              placeholder="Ex: Marketing Digital"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tom</label>
            <select value={tom} onChange={(e) => setTom(e.target.value)}>
              <option value="engajante">Engajante</option>
              <option value="profissional">Profissional</option>
              <option value="educacional">Educacional</option>
              <option value="divertido">Divertido</option>
            </select>
          </div>

          <button type="submit" disabled={carregando} className="btn-primary">
            {carregando ? '⏳ Gerando...' : '✨ Gerar Roteiro'}
          </button>
        </form>

        {roteiro && (
          <div className="roteiro-resultado">
            <h3>📝 Seu Roteiro</h3>
            
            <div className="roteiro-card">
              <h4>{roteiro.titulo}</h4>
              <p>{roteiro.conteudo}</p>
              
              {roteiro.cta && <p><strong>CTA:</strong> {roteiro.cta}</p>}
              
              {roteiro.hashtags && (
                <p><strong>Hashtags:</strong> {roteiro.hashtags.join(', ')}</p>
              )}
            </div>

            {roteiro.imagem_url && (
              <div className="imagem-resultado">
                <img src={roteiro.imagem_url} alt="Imagem gerada" />
              </div>
            )}

            {!roteiro.imagem_url && (
              <button 
                onClick={handleGerarImagem} 
                disabled={carregando}
                className="btn-secondary"
              >
                {carregando ? '⏳ Gerando...' : '🖼️ Gerar Imagem'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
