// URU — Servicio de chatbot con DeepSeek via OpenRouter
const https = require('https');

const API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder';
const MODEL = 'deepseek/deepseek-chat-v3-0324';

const SYSTEM_PROMPT = `Sos URU, el asistente virtual de la Municipalidad de Eldorado, Misiones, Argentina.
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

function buildMessages(userQuestion, context) {
  const msgs = [{ role: 'system', content: SYSTEM_PROMPT }];
  if (context) {
    msgs.push({ role: 'system', content: 'Información de contexto del sitio municipal:\n' + context });
  }
  msgs.push({ role: 'user', content: userQuestion });
  return msgs;
}

function chatOpenRouter(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 300,
    });

    const req = https.request({
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
        'HTTP-Referer': 'https://eldorado.gob.ar',
        'X-Title': 'URU - Chatbot Municipal',
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message || 'OpenRouter error'));
          const reply = parsed.choices?.[0]?.message?.content;
          if (!reply) return reject(new Error('Sin respuesta del modelo'));
          resolve(reply);
        } catch (e) {
          reject(new Error('Error parseando respuesta: ' + data.slice(0, 100)));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function askUru(userQuestion, contextData) {
  const messages = buildMessages(userQuestion, contextData || '');
  return chatOpenRouter(messages);
}

module.exports = { askUru };
