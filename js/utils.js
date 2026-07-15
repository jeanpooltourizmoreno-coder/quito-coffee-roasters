/**
 * js/utils.js
 * ------------------------------------------------------------------
 * Funciones puras y helpers de DOM reutilizados por el resto de la
 * aplicación. Mantener este archivo sin dependencias de otros módulos
 * de la app (solo utilidades genéricas) para evitar ciclos de import.
 * ------------------------------------------------------------------
 */

/** Selector corto para un solo elemento. */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/** Selector corto para una lista de elementos (devuelve array real). */
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/** Formatea un número como moneda. currency: 'USD' | 'EUR'. */
export function formatCurrency(amount, currency = 'USD') {
  const symbols = { USD: '$', EUR: '€' };
  const symbol = symbols[currency] ?? '';
  return `${symbol}${Number(amount).toFixed(2)}`;
}

/** Debounce: retrasa la ejecución de fn hasta que el usuario deja de escribir. */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/** Validación simple pero robusta de email. */
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Acepta teléfonos ecuatorianos/internacionales con 7-10 dígitos, espacios, +, -. */
export function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 10;
}

/** Capitaliza la primera letra de una cadena. */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Muestra un mensaje de estado (error/éxito/info) dentro de un contenedor.
 * El propio contenedor decide su estilo vía la clase `data-state`.
 */
export function setStatusMessage(container, message, state = 'info') {
  if (!container) return;
  container.textContent = message;
  container.dataset.state = state;
  container.hidden = !message;
}

/** Crea un elemento con clases y contenido de una sola vez (azúcar sintáctico). */
export function createEl(tag, { classes = [], text = '', html = '', attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (text) el.textContent = text;
  if (html) el.innerHTML = html;
  Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
  return el;
}
