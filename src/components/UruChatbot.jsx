import { useState, useRef, useEffect } from 'react';
import { uruKnowledge } from '../data/uruKnowledge';
import './UruChatbot.css';

const INITIAL_MESSAGE = {
  from: 'uru',
  text: '¡Hola! Soy URU, tu asistente virtual de la Municipalidad de Eldorado. ¿En qué puedo ayudarte hoy?',
};

export default function UruChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(m => [...m, { from: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, context: uruKnowledge }),
      });
      const data = await res.json();
      setMessages(m => [...m, { from: 'uru', text: data.answer || 'No pude obtener una respuesta.' }]);
    } catch {
      setMessages(m => [...m, { from: 'uru', text: 'Error de conexión. Intentá de nuevo.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="uru-container">
      {!open && (
        <button className="uru-fab" onClick={() => setOpen(true)} aria-label="Abrir chat URU">
          💬
        </button>
      )}
      {open && (
        <div className="uru-panel">
          <div className="uru-header">
            <div className="uru-avatar">URU</div>
            <div className="uru-header-text">
              <div className="uru-name">Asistente URU</div>
              <div className="uru-sub">Municipalidad de Eldorado</div>
            </div>
            <button className="uru-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="uru-messages">
            {messages.map((m, i) => (
              <div key={i} className={`uru-msg uru-msg--${m.from}`}>
                <div className="uru-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="uru-msg uru-msg--uru">
                <div className="uru-bubble uru-typing">Escribiendo…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="uru-input-area">
            <input
              className="uru-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Escribí tu pregunta…"
              disabled={loading}
            />
            <button className="uru-send" onClick={sendMessage} disabled={loading}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}
