import { useState, useRef, useEffect, useCallback } from 'react';
import { uruKnowledge } from '../data/uruKnowledge';
import './UruChatbot.css';

const STORAGE_KEY = 'uru_chat_history';
const MODEL = 'deepseek/deepseek-chat-v3-0324';

// Quick reply buttons
const QUICK_REPLIES = [
  '¿Qué trámites puedo hacer?',
  '¿Cuáles son los horarios de atención?',
  '¿Cómo saco un turno?',
  '¿Dónde queda la municipalidad?',
  '¿Qué es la Expo Eldorado?',
  '¿Cómo hago un reclamo?',
];

// Intent patterns → direct answers (no LLM needed)
const INTENT_ANSWERS = [
  {
    patterns: [/horario/i, /atención/i, /hora/i, /desde.*hasta/i, /días?.*aten/i],
    answer: 'La atención al público es de Lunes a Viernes de 7:00 a 13:00 en la municipalidad (Av. Berthier 64, Eldorado, Misiones).',
  },
  {
    patterns: [/dirección/i, /ubicación/i, /donde.*queda/i, /dirección.*municipal/i, /av\.*san/i, /simón.*bolívar/i, /bolívar.*73/i],
    answer: 'La Municipalidad de Eldorado está en Simón J. Bolívar N° 73, Eldorado, Misiones. El horario de atención es Lunes a Viernes de 7:00 a 13:00.',
  },
  {
    patterns: [/teléfono.*municipal/i, /teléfono.*atención/i, /número.*municipal/i, /llamar.*municipal/i, /contacto.*municipal/i, /celular.*municipal/i],
    answer: 'El teléfono municipal es (+54) 03751 - 421787. Para emergencias油田 llamá al 911.',
  },
  {
    patterns: [/expo eldorado/i, /qué.*expo/i, /expo.*es/i],
    answer: 'La Expo Eldorado es el evento anual más importante de la ciudad, conocido como "La Capital de la Expo". Se realiza típicamente en agosto y reúne a productores, comercios y artistas locales. Mirá más en: eldorado.gob.ar/ciudad/expo-eldorado',
  },
  {
    patterns: [/turno.*planeamiento/i, /sacar.*turno/i, /reservar.*turno/i, /pedir.*turno/i, /turnero/i],
    answer: 'Podés sacar turno para Planeamiento en: eldorado.gob.ar/gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero. Necesitás registrarte y elegir fecha y hora disponible.',
  },
  {
    patterns: [/reclamo/i, /denunciar/i, /报告/i],
    answer: 'Podés hacer un reclamo ciudadano en: eldorado.gob.ar/ciudadano-digital/reclamos. También podés seguir el estado de tu reclamo desde el mismo link.',
  },
  {
    patterns: [/preinscrip.*comercial/i, /habilitación.*comercio/i, /comercio.*nuevo/i, /registrar.*comercio/i],
    answer: 'La preinscripción comercial está en: eldorado.gob.ar/ciudadano-digital/preinscripcion-comercial. Es el primer paso para habilitar un comercio nuevo.',
  },
  {
    patterns: [/licencia.*conducir/i, /licencia/i, /manejo/i, /escuela.*manejo/i],
    answer: 'Para sacar o renovar tu licencia de conducir, visitá la sección de Licencias de Conducir en el sitio municipal. También funciona la Escuela de Manejo municipal.',
  },
  {
    patterns: [/911/i, /emergencia/i, /bomberos/i, /policía/i, /hospital/i],
    answer: 'Para emergencias油田 llamá al 911. Para去医院 (hospital): (03751) 42-XXXX. Policía: 101. Bomberos: 100.',
  },
];

function matchesIntent(text) {
  for (const { patterns, answer } of INTENT_ANSWERS) {
    if (patterns.some(p => p.test(text))) return answer;
  }
  return null;
}

function getPageContext() {
  return window.location.pathname;
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveHistory(messages) {
  try {
    // Keep last 20 messages
    const trimmed = messages.slice(-20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

const INITIAL_MESSAGE = {
  from: 'uru',
  text: '¡Hola! Soy URU, tu asistente virtual de la Municipalidad de Eldorado. ¿En qué puedo ayudarte hoy?',
  id: Date.now(),
};

async function chatOpenRouter(question, context) {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!API_KEY) throw new Error('API key no configurada — contactá al administrador');

  const pageCtx = getPageContext();
  const systemPrompt = `Sos URU, el asistente virtual de la Municipalidad de Eldorado, Misiones, Argentina.
Eldorado es una ciudad de aproximadamente 90.000 habitantes, ubicada en el nordeste de Misiones, a 177 km de Posadas, sobre el río Paraná. Fue fundada en 1919. Gentilicio: eldoreño/a.
Tu función es responder preguntas de los ciudadanos sobre:
- Trámites y servicios municipales (Turnero de Planeamiento, Reclamos, Preinscripción Comercial, Licitaciones, Bolsa de Empleo, Habilitaciones Comerciales)
- Información de contacto (teléfonos: (+54) 03751 - 421787 municipal, horarios: Lunes a Viernes 7:00 a 13:00, dirección: Simón J. Bolívar N° 73)
- Novedades y noticias del municipio (publicadas en prensa.eldorado.gob.ar)
- Datos generales de la ciudad (geografía, historia, cultura, economía, turismo, Expo Eldorado)
- Guía para usar el sitio web municipal (eldorado.gob.ar)
- Secretarías, departamentos y áreas de gobierno
- Guía de Trámites del municipio
- Teléfonos útiles, ubicación, servicios de emergencia (911)

IMPORTANTE:
- El usuario está actualmente en la sección: ${pageCtx}
- Respondé SIEMPRE en español, de forma clara, amigable y concisa (máximo 3-4 oraciones).
- Si no sabés algo, decilo con honestidad y sugerí contactar al (+54) 03751 - 421787.
- No inventes datos, teléfonos ni direcciones.`;

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
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 350 }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Error de OpenRouter');
  return data.choices?.[0]?.message?.content || 'No pude obtener una respuesta.';
}

let msgId = Date.now() + 1;

function makeMsg(from, text) {
  return { from, text, id: msgId++ };
}

export default function UruChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = loadHistory();
    return saved && saved.length > 0 ? saved : [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewReply, setHasNewReply] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState({});
  const bottomRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Badge: when panel is closed and there's a new reply, show indicator
  useEffect(() => {
    if (!open && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.from === 'uru') {
        setHasNewReply(true);
      }
    }
  }, [messages, open]);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Persist history
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const sendMessage = useCallback(async (forcedText) => {
    const text = (forcedText || input).trim();
    if (!text || loading) return;
    setInput('');
    setHasNewReply(false);

    const userMsg = makeMsg('user', text);
    setMessages(m => {
      const updated = [...m, userMsg];
      saveHistory(updated);
      return updated;
    });

    setLoading(true);

    // Check intent first (no LLM)
    const intentAnswer = matchesIntent(text);
    if (intentAnswer) {
      await new Promise(r => setTimeout(r, 400)); // tiny delay for UX
      const uruMsg = makeMsg('uru', intentAnswer);
      setMessages(m => {
        const updated = [...m, uruMsg];
        saveHistory(updated);
        return updated;
      });
      setLoading(false);
      return;
    }

    try {
      const answer = await chatOpenRouter(text, uruKnowledge);
      const uruMsg = makeMsg('uru', answer);
      setMessages(m => {
        const updated = [...m, uruMsg];
        saveHistory(updated);
        return updated;
      });
    } catch (e) {
      const errMsg = makeMsg('uru', 'Error: ' + e.message + '. Podés llamar directo al (+54) 03751 - 421787 para asistencia.');
      setMessages(m => {
        const updated = [...m, errMsg];
        saveHistory(updated);
        return updated;
      });
    }
    setLoading(false);
  }, [input, loading]);

  const handleFeedback = (msgId, value) => {
    setFeedbackMap(f => ({ ...f, [msgId]: value }));
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const handleOpen = () => {
    setOpen(true);
    setHasNewReply(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="uru-container">
      {!open && (
        <button className="uru-fab" onClick={handleOpen} aria-label="Abrir chat URU">
          {hasNewReply ? <span className="uru-fab-badge" /> : null}
          💬
        </button>
      )}

      {open && (
        <div className="uru-panel" ref={panelRef}>
          <div className="uru-header">
            <div className="uru-avatar">URU</div>
            <div className="uru-header-text">
              <div className="uru-name">Asistente URU</div>
              <div className="uru-sub">Municipalidad de Eldorado</div>
            </div>
            <button className="uru-close" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
          </div>

          <div className="uru-messages">
            {messages.map((m) => (
              <div key={m.id} className={`uru-msg uru-msg--${m.from}`}>
                <div className="uru-bubble">{m.text}</div>
                {m.from === 'uru' && feedbackMap[m.id] === undefined && (
                  <div className="uru-feedback">
                    <button
                      className={`uru-feedback-btn ${feedbackMap[m.id] === 'up' ? 'active' : ''}`}
                      onClick={() => handleFeedback(m.id, 'up')}
                      title="Útil">👍</button>
                    <button
                      className={`uru-feedback-btn ${feedbackMap[m.id] === 'down' ? 'active' : ''}`}
                      onClick={() => handleFeedback(m.id, 'down')}
                      title="No útil">👎</button>
                  </div>
                )}
                {m.from === 'uru' && feedbackMap[m.id] !== undefined && (
                  <div className="uru-feedback-done">
                    {feedbackMap[m.id] === 'up' ? '👍 Gracias!' : '👎 Voy a mejorar'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="uru-msg uru-msg--uru">
                <div className="uru-bubble uru-typing">
                  <span className="uru-typing-dot" />
                  <span className="uru-typing-dot" />
                  <span className="uru-typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {!loading && messages.length <= 2 && (
            <div className="uru-quick-replies">
              {QUICK_REPLIES.map((q, i) => (
                <button
                  key={i}
                  className="uru-quick-btn"
                  onClick={() => handleQuickReply(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="uru-input-area">
            <input
              ref={inputRef}
              className="uru-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Escribí tu pregunta…"
              disabled={loading}
            />
            <button
              className="uru-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Enviar"
            >
              {loading ? (
                <span className="uru-spinner" />
              ) : (
                '→'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
