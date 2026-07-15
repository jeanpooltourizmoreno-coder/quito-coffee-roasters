/**
 * js/api.js
 * ------------------------------------------------------------------
 * Toda la comunicación con APIs públicas vive aquí, aislada del resto
 * de la app. Cada función:
 *   1. Usa fetch() + async/await.
 *   2. Está envuelta en try/catch.
 *   3. Nunca deja caer un error sin manejar: si la API externa falla
 *      o no responde a tiempo, se devuelve un resultado de respaldo
 *      (fallback) para que la interfaz jamás se quede rota o vacía.
 * ------------------------------------------------------------------
 */

const QUITO_COORDS = { latitude: -0.1807, longitude: -78.4678 };
const FETCH_TIMEOUT_MS = 6000;

/** Envuelve fetch con un tiempo límite para no dejar la UI esperando para siempre. */
async function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* 1. Clima actual de Quito — Open-Meteo (sin API key)                 */
/* ------------------------------------------------------------------ */
const WEATHER_CODES = {
  0: { label: 'Cielo despejado', icon: '☀️' },
  1: { label: 'Mayormente despejado', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Neblina', icon: '🌫️' },
  48: { label: 'Neblina helada', icon: '🌫️' },
  51: { label: 'Llovizna ligera', icon: '🌦️' },
  61: { label: 'Lluvia ligera', icon: '🌧️' },
  63: { label: 'Lluvia moderada', icon: '🌧️' },
  65: { label: 'Lluvia intensa', icon: '🌧️' },
  80: { label: 'Chubascos', icon: '🌦️' },
  95: { label: 'Tormenta eléctrica', icon: '⛈️' },
};

export async function getQuitoWeather() {
  const { latitude, longitude } = QUITO_COORDS;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=America%2FGuayaquil`;

  try {
    const data = await fetchWithTimeout(url);
    const current = data.current_weather;
    const info = WEATHER_CODES[current.weathercode] ?? { label: 'Clima variable', icon: '🌡️' };
    return {
      ok: true,
      temperature: Math.round(current.temperature),
      description: info.label,
      icon: info.icon,
    };
  } catch (error) {
    console.warn('No se pudo obtener el clima de Quito:', error.message);
    return {
      ok: false,
      temperature: 18,
      description: 'Clima no disponible ahora mismo',
      icon: '🌡️',
    };
  }
}

/* ------------------------------------------------------------------ */
/* 2. Frase inspiracional del día — Quotable (con respaldo local)      */
/* ------------------------------------------------------------------ */
const LOCAL_QUOTES = [
  { text: 'El buen café, como la buena amistad, se disfruta despacio.', author: 'Refrán tostador' },
  { text: 'Cada grano cuenta una historia de montaña, sol y paciencia.', author: 'Quito Coffee Roasters' },
  { text: 'Un café bien tostado empieza siempre por un buen grano verde.', author: 'Tradición cafetera' },
];

export async function getDailyQuote() {
  try {
    const data = await fetchWithTimeout('https://api.quotable.io/random?maxLength=90');
    return { ok: true, text: data.content, author: data.author };
  } catch (error) {
    console.warn('Quotable no respondió, usando frase local:', error.message);
    const fallback = LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
    return { ok: false, ...fallback };
  }
}

/* ------------------------------------------------------------------ */
/* 3. Tipo de cambio USD -> EUR — ExchangeRate API (sin API key)       */
/* ------------------------------------------------------------------ */
export async function getUsdToEurRate() {
  try {
    const data = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD');
    const rate = data?.rates?.EUR;
    if (!rate) throw new Error('Tasa EUR no encontrada en la respuesta');
    return { ok: true, rate };
  } catch (error) {
    console.warn('No se pudo obtener el tipo de cambio, usando tasa de referencia:', error.message);
    // Tasa de referencia aproximada de respaldo, solo para no romper el cálculo.
    return { ok: false, rate: 0.92 };
  }
}
