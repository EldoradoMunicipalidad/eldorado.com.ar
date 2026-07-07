import { useState, useRef, useEffect, useCallback } from 'react';
import { uruKnowledge } from '../data/uruKnowledge';
import './UruChatbot.css';

const STORAGE_KEY = 'uru_chat_history';
const MODEL = 'deepseek/deepseek-chat-v3-0324';

const QUICK_REPLIES = [
  '¿Qué trámites puedo hacer?',
  '¿Cómo saco un turno?',
  '¿Cómo hago un reclamo?',
  '¿Dónde queda la municipalidad?',
  '¿Qué es la Expo Eldorado?',
];

// Intent patterns → direct answers (no LLM needed)
const INTENT_ANSWERS = [
  {
    patterns: [/turno.*planeamiento/i, /sacar.*turno/i, /reservar.*turno/i, /pedir.*turno/i, /turnero/i],
    answer: 'Podés sacar turno para Planeamiento en: eldorado.gob.ar/gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero',
  },
  {
    patterns: [/reclamo/i, /denunciar/i],
    answer: 'Podés hacer un reclamo ciudadano en: eldorado.gob.ar/ciudadano-digital/reclamos. También podés seguir el estado de tu reclamo desde el mismo link.',
  },
  {
    patterns: [/preinscrip.*comercial/i, /habilitación.*comercio/i, /comercio.*nuevo/i, /registrar.*comercio/i],
    answer: 'La preinscripción comercial está en: eldorado.gob.ar/ciudadano-digital/preinscripcion-comercial',
  },
  {
    patterns: [/expo eldorado/i, /qué.*expo/i, /expo.*es/i],
    answer: 'La Expo Eldorado es el evento anual más importante de la ciudad. Más información en: eldorado.gob.ar/ciudad/expo-eldorado',
  },
  {
    patterns: [/balancete/i, /balance.*trimestral/i, /finanzas/i, /tributo/i],
    answer: 'Encontrás los balances y finanzas públicas en: eldorado.gob.ar/gobierno-abierto/finanzas-publicas y eldorado.gob.ar/gobierno-abierto/balancetes-trimestrales',
  },
  {
    patterns: [/licitacion/i, /compra.*municipal/i, /proveedor/i],
    answer: 'Las licitaciones públicas están en: eldorado.gob.ar/gobierno-abierto/licitaciones',
  },
  {
    patterns: [/organigrama/i, /planta.*personal/i, /empleado/i, /escal.*salari/i],
    answer: 'Encontrás esa info en la sección de Gobierno Abierto: eldorado.gob.ar/gobierno-abierto/organigrama y eldorado.gob.ar/gobierno-abierto/planta-personal',
  },
  {
    patterns: [/horario/i, /atención/i, /hora/i],
    answer: 'Consultá la sección de contacto o teléfonos útiles del sitio municipal para conocer los horarios actualizados: eldorado.gob.ar/ciudad/contacto',
  },
  {
    patterns: [/teléfono/i, /contacto/i, /llamar/i],
    answer: 'Los teléfonos útiles están en: eldorado.gob.ar/ciudad/telefonos-utiles',
  },
  {
    patterns: [/dirección/i, /ubicación/i, /donde.*queda/i],
    answer: 'La dirección y ubicación están en la sección de contacto: eldorado.gob.ar/ciudad/contacto',
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
    const trimmed = messages.slice(-20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

const INITIAL_MESSAGE = {
  from: 'uru',
  text: '¡Hola! Soy URU, tu asistente virtual de la Municipalidad de Eldorado. Solo puedo ayudarte con información publicada en el sitio web eldorado.gob.ar. ¿En qué puedo ayudarte?',
  id: Date.now(),
};

async function chatOpenRouter(question, context) {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!API_KEY) throw new Error('API key no configurada');

  const pageCtx = getPageContext();
  const systemPrompt = `Sos URU, el asistente virtual de la Municipalidad de Eldorado.
 Solo podés responder usando INFORMACIÓN que figure en el sitio web oficial: eldorado.gob.ar
 NO podés inventar, asumir ni completar datos que no estén explicitamente en el sitio.

 El usuario está actualmente en: ${pageCtx}

 SECCIONES PRINCIPALES DEL SITIO:
 - Trámites: /ciudadano-digital/reclamos, /ciudadano-digital/preinscripcion-comercial
 - Turnero: /gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero
 - Finanzas: /gobierno-abierto/finanzas-publicas, /gobierno-abierto/balancetes-trimestrales
 - Tributos: /gobierno-abierto/tributos
 - Licitaciones: /gobierno-abierto/licitaciones
 - Gobierno: /gobierno/intendencia, /gobierno/secretaria-gobierno, /gobierno/secretaria-hacienda
 - Contacto: /ciudad/contacto, /ciudad/telefonos-utiles
 - Noticias: prensa.eldorado.gob.ar

 REGLAS:
 - Si no estás seguro de un dato (horario, teléfono, dirección), decí que consultes la sección correspondiente del sitio.
 - Nunca inventés información de contacto.
 - Respondé en español, máximo 3 oraciones.
 - Solo hablá de contenidos que estén publicados en el sitio oficial.`;

  const messages = [{ role: 'system', content: systemPrompt }];
  if (context) messages.push({ role: 'system', content: 'Contexto del sitio:\n' + context });
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

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (!open && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.from === 'uru') {
        setHasNewReply(true);
      }
    }
  }, [messages, open]);

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

    const intentAnswer = matchesIntent(text);
    if (intentAnswer) {
      await new Promise(r => setTimeout(r, 400));
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
      const errMsg = makeMsg('uru', 'Error al obtener respuesta. Podés consultar directamente en el sitio: eldorado.gob.ar');
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
          <img src="/uru-chat-icon.png" alt="URU" className="uru-fab-icon" />
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
