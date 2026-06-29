import { useState, useRef, useEffect } from 'react';
import { uruKnowledge } from '../data/uruKnowledge';
import './UruChatbot.css';

const INITIAL_MESSAGE = {
  from: 'uru',
  text: '¡Hola! Soy URU, tu asistente virtual de la Municipalidad de Eldorado. ¿En qué puedo ayudarte hoy?',
};

const MODEL = 'deepseek/deepseek-chat-v3-0324';

async function chatOpenRouter(question, context) {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!API_KEY) throw new Error('API key no configurada');

  const systemPrompt = `Sos URU, el asistente virtual de la Municipalidad de Eldorado, Misiones, Argentina.
Eldorado es una ciudad de aproximadamente 90.000 habitantes, ubicada en el nordeste de Misiones, a 177 km de Posadas, sobre el río Paraná. Fue fundada en 1919.
Tu función es responder preguntas de los ciudadanos sobre:
- Trámites y servicios municipales (Turnero de Planeamiento, Reclamos, Preinscripción Comercial, Licitaciones, Bolsa de Empleo)
- Información de contacto (teléfonos, direcciones, horarios de atención al público: Lunes a Viernes 7:00 a 13:00)
- Novedades y noticias del municipio (publicadas en prensa.eldorado.gob.ar)
- Datos generales de la ciudad (geografía, historia, cultura, economía, turismo)
- Guía para usar el sitio web municipal (eldorado.gob.ar)
- Secretarías, departamentos y áreas de gobierno
- Guía de Trámites del municipio

Responde SIEMPRE en español, de forma clara, amigable y concisa (máximo 3-4 oraciones).
Si no sabés algo, decilo con honestidad y sugerí contactar directamente al área correspondiente.
No inventes datos, teléfonos ni direcciones.`;

  const messages = [{ role: 'system', content: systemPrompt }];
  if (context) messages.push({ role: 'system', content: 'Información de contexto del sitio municipal:\n' + context });
  messages.push({ role: 'user', content: question });

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + API_KEY,
      'HTTP-Referer': 'https://eldorado.gob.ar',
      'X-Title': 'URU - Chatbot Municipal',
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 300 }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Error de OpenRouter');
  return data.choices?.[0]?.message?.content || 'No pude obtener una respuesta.';
}

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
      const answer = await chatOpenRouter(text, uruKnowledge);
      setMessages(m => [...m, { from: 'uru', text: answer }]);
    } catch (e) {
      setMessages(m => [...m, { from: 'uru', text: 'Error: ' + e.message }]);
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
