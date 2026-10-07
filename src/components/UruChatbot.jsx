import { useState, useRef, useEffect, useCallback } from 'react';
import { getUruContext } from '../data/uruKnowledge';
import './UruChatbot.css';

const QUICK_REPLIES = [
  '¿Qué trámites puedo hacer?',
  '¿Cómo saco un turno?',
  '¿Cómo hago un reclamo?',
  '¿Dónde queda la municipalidad?',
  '¿Qué es la Expo Eldorado?',
];

const WORKFLOW_ACTIONS = {
  turnos: [
    { label: 'Turnero de Planeamiento', href: '/gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero' },
    { label: 'Turnero de Escuela de Manejo', href: '/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo/turnero' },
  ],
  reclamos: [{ label: 'Iniciar o seguir un reclamo', href: '/ciudadano-digital/reclamos' }],
  ambiente: [{ label: 'Ver trámites de Ambiente', href: '/guia-de-tramites' }],
  preinscripcion: [{ label: 'Abrir preinscripción comercial', href: '/ciudadano-digital/preinscripcion-comercial' }],
  tramites: [{ label: 'Abrir Guía de Trámites', href: '/guia-de-tramites' }],
};

function getWorkflowActions(text) {
  const normalized = text.toLocaleLowerCase('es');
  if (/turno|turnero/.test(normalized)) return WORKFLOW_ACTIONS.turnos;
  if (/ambient/.test(normalized) && /denuncia|reclamo/.test(normalized)) return WORKFLOW_ACTIONS.ambiente;
  if (/reclamo|denuncia/.test(normalized)) return WORKFLOW_ACTIONS.reclamos;
  if (/preinscrip|habilitaci[oó]n comercial|comercio/.test(normalized)) return WORKFLOW_ACTIONS.preinscripcion;
  if (/tr[aá]mite/.test(normalized)) return WORKFLOW_ACTIONS.tramites;
  return [];
}

function getFeedbackTopic(text) {
  const normalized = text.toLocaleLowerCase('es');
  if (/turno|turnero/.test(normalized)) return 'turnos';
  if (/ambient/.test(normalized)) return 'ambiente';
  if (/reclamo|denuncia/.test(normalized)) return 'reclamos';
  if (/preinscrip|habilitaci[oó]n comercial|comercio/.test(normalized)) return 'preinscripcion';
  if (/tel[eé]fono|contacto|direcci[oó]n|horario/.test(normalized)) return 'contacto';
  if (/tr[aá]mite/.test(normalized)) return 'tramites';
  return 'general';
}

function getPageContext() {
  return window.location.pathname;
}

const INITIAL_MESSAGE = {
  from: 'uru',
  text: '¡Hola! Soy URU, tu asistente virtual de la Municipalidad de Eldorado. Solo puedo ayudarte con información publicada en el sitio web eldorado.gob.ar. ¿En qué puedo ayudarte?',
  id: Date.now(),
};

async function chatUru(question, context, history) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      context,
      history,
      page: getPageContext(),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const error = new Error(data.error || 'No se pudo obtener una respuesta.');
    error.status = res.status;
    throw error;
  }
  return data.response || 'No pude obtener una respuesta.';
}

let msgId = Date.now() + 1;

function makeMsg(from, text, extra = {}) {
  return { from, text, id: msgId++, ...extra };
}

const URL_TOKEN_RE = /(https?:\/\/[^\s<>()[\]{}"',!?;]+|(?:www\.)?eldorado\.(?:gob\.ar|com\.ar)\/[^\s<>()[\]{}"',!?;]+)/gi;

function isApprovedLink(value) {
  try {
    const url = new URL(value.startsWith('http') ? value : 'https://' + value);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === 'https:' &&
      (
        host === 'eldorado.gob.ar' ||
        host.endsWith('.eldorado.gob.ar') ||
        host === 'eldorado.com.ar' ||
        host.endsWith('.eldorado.com.ar') ||
        host === 'docs.google.com' ||
        host === 'drive.google.com' ||
        host.endsWith('.argentina.gob.ar') ||
        host === 'argentina.gob.ar' ||
        host === 'seguridadvial.gob.ar' ||
        host.endsWith('.misiones.gob.ar')
      )
    );
  } catch {
    return false;
  }
}

function renderMessageText(text) {
  if (typeof text !== 'string') return text;
  return text.split(URL_TOKEN_RE).map((part, index) => {
    const href = part.startsWith('http') ? part : 'https://' + part;
    if (!isApprovedLink(part)) return <span key={index}>{part}</span>;
    return (
      <a
        key={index}
        className="uru-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </a>
    );
  });
}

export default function UruChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState({});
  const bottomRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.removeItem('uru_chat_history');
    } catch {
      // El almacenamiento puede estar bloqueado en modo privado o por políticas del navegador.
    }
  }, []);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const sendMessage = useCallback(async (forcedText) => {
    const text = (forcedText || input).trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = makeMsg('user', text);
    setMessages(m => [...m, userMsg]);

    setLoading(true);

    try {
      const answer = await chatUru(text, getUruContext(text, getPageContext()), messages);
      const uruMsg = makeMsg('uru', answer, {
        actions: getWorkflowActions(text),
        topic: getFeedbackTopic(text),
      });
      setMessages(m => [...m, uruMsg]);
    } catch (error) {
      const message = error.status === 503
        ? 'URU no está disponible en este momento. Podés consultar las opciones oficiales en el sitio municipal.'
        : 'No pude conectarme para responder. Revisá tu conexión e intentá de nuevo.';
      const errMsg = makeMsg('uru', message, {
        retryText: text,
        actions: getWorkflowActions(text),
        topic: getFeedbackTopic(text),
      });
      setMessages(m => [...m, errMsg]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  const handleFeedback = async (message, value) => {
    setFeedbackMap(f => ({ ...f, [message.id]: { value, status: 'sending' } }));
    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value, topic: message.topic || 'general', page: getPageContext() }),
      });
      if (!response.ok) throw new Error('No se pudo guardar la valoración');
      setFeedbackMap(f => ({ ...f, [message.id]: { value, status: 'sent' } }));
    } catch {
      setFeedbackMap(f => ({ ...f, [message.id]: { value, status: 'error' } }));
    }
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const handleOpen = () => {
    setOpen(true);
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
        <div className="uru-panel" ref={panelRef} role="region" aria-label="Asistente virtual URU">
          <div className="uru-header">
            <div className="uru-avatar">URU</div>
            <div className="uru-header-text">
              <div className="uru-name">Asistente URU</div>
              <div className="uru-sub">Municipalidad de Eldorado</div>
            </div>
            <button className="uru-close" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
          </div>

          <div className="uru-messages" aria-live="polite" aria-relevant="additions text">
            {messages.map((m) => (
              <div key={m.id} className={`uru-msg uru-msg--${m.from}`}>
                <div className="uru-bubble">{renderMessageText(m.text)}</div>
                {m.actions?.length > 0 && (
                  <div className="uru-actions">
                    {m.actions.map(action => (
                      <a key={action.href} className="uru-action" href={action.href}>
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}
                {m.retryText && (
                  <button className="uru-retry" onClick={() => sendMessage(m.retryText)}>
                    Reintentar
                  </button>
                )}
                {m.from === 'uru' && (!feedbackMap[m.id] || feedbackMap[m.id].status === 'error') && (
                  <div className="uru-feedback">
                    <button
                      className="uru-feedback-btn"
                      onClick={() => handleFeedback(m, 'up')}
                      disabled={feedbackMap[m.id]?.status === 'sending'}
                      title="Útil" aria-label="Esta respuesta fue útil">👍</button>
                    <button
                      className="uru-feedback-btn"
                      onClick={() => handleFeedback(m, 'down')}
                      disabled={feedbackMap[m.id]?.status === 'sending'}
                      title="No útil" aria-label="Esta respuesta no fue útil">👎</button>
                  </div>
                )}
                {m.from === 'uru' && feedbackMap[m.id]?.status === 'sent' && (
                  <div className="uru-feedback-done">
                    {feedbackMap[m.id].value === 'up' ? '👍 ¡Gracias!' : '👎 Gracias, revisaremos esta respuesta.'}
                  </div>
                )}
                {feedbackMap[m.id]?.status === 'error' && <div className="uru-feedback-error">No se pudo guardar. Podés volver a valorar.</div>}
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
              aria-label="Escribí tu pregunta para URU"
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
