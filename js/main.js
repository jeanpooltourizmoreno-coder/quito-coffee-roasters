/**
 * js/main.js
 * ------------------------------------------------------------------
 * Punto de entrada de la aplicación. Se importa como módulo ES6 desde
 * index.html (`<script type="module" src="js/main.js">`). Aquí se
 * conectan los datos y la lógica de los otros módulos con los
 * elementos reales del DOM y se registran los listeners de eventos.
 * ------------------------------------------------------------------ */

import { getQuitoWeather, getDailyQuote } from './api.js';
import {
  renderCatalog,
  setOriginFilter,
  setSearchQuery,
  getAvailableOrigins,
  findCoffeeById,
} from './products.js';
import {
  addToCart,
  changeQty,
  removeFromCart,
  setDeliveryZone,
  toggleCurrency,
  renderCart,
} from './cart.js';
import { qs, qsa, debounce, isValidEmail, isValidPhone, setStatusMessage } from './utils.js';

/* ------------------------------------------------------------------ */
/* Referencias al DOM                                                  */
/* ------------------------------------------------------------------ */
const dom = {
  navToggle: qs('.nav-toggle'),
  nav: qs('#nav-menu'),
  weatherBadge: qs('#weather-badge'),
  quoteText: qs('#quote-text'),
  quoteAuthor: qs('#quote-author'),
  searchInput: qs('#search-input'),
  catalogGrid: qs('#catalog-grid'),
  catalogEmpty: qs('#catalog-empty'),
  cartList: qs('#cart-list'),
  cartEmpty: qs('#cart-empty'),
  cartCount: qs('#cart-count'),
  subtotalEl: qs('#cart-subtotal'),
  shippingEl: qs('#cart-shipping'),
  totalEl: qs('#cart-total'),
  zoneSelect: qs('#zone-select'),
  currencyToggle: qs('#currency-toggle'),
  contactForm: qs('#contact-form'),
  formStatus: qs('#form-status'),
  yearEl: qs('#current-year'),
};

const cartRefs = {
  listEl: dom.cartList,
  subtotalEl: dom.subtotalEl,
  shippingEl: dom.shippingEl,
  totalEl: dom.totalEl,
  countEl: dom.cartCount,
  emptyEl: dom.cartEmpty,
};

/* ------------------------------------------------------------------ */
/* Hero: clima + frase del día                                         */
/* ------------------------------------------------------------------ */
async function initHero() {
  dom.weatherBadge.textContent = 'Consultando clima de Quito…';
  dom.quoteText.textContent = 'Cargando frase del día…';

  const [weather, quote] = await Promise.all([getQuitoWeather(), getDailyQuote()]);

  dom.weatherBadge.innerHTML = `<span aria-hidden="true">${weather.icon}</span> ${weather.temperature}°C · ${weather.description}`;
  dom.quoteText.textContent = `“${quote.text}”`;
  dom.quoteAuthor.textContent = `— ${quote.author}`;
}

/* ------------------------------------------------------------------ */
/* Catálogo: filtros, búsqueda y "agregar al pedido"                   */
/* ------------------------------------------------------------------ */
function initCatalog() {
  // Botones de filtro por origen, generados a partir de los datos reales.
  const origins = ['todos', ...getAvailableOrigins()];
  const filterBar = qs('#filter-bar');
  filterBar.innerHTML = '';
  origins.forEach((origin) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn';
    btn.dataset.origin = origin;
    btn.textContent = origin === 'todos' ? 'Todos' : origin;
    btn.setAttribute('aria-pressed', origin === 'todos' ? 'true' : 'false');
    filterBar.appendChild(btn);
  });

  filterBar.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;
    qsa('.filter-btn', filterBar).forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    setOriginFilter(btn.dataset.origin);
    renderCatalog(dom.catalogGrid, dom.catalogEmpty);
  });

  dom.searchInput.addEventListener(
    'input',
    debounce((event) => {
      setSearchQuery(event.target.value);
      renderCatalog(dom.catalogGrid, dom.catalogEmpty);
    }, 250),
  );

  dom.catalogGrid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;
    const coffee = findCoffeeById(btn.dataset.id);
    if (!coffee) return;
    addToCart(coffee);
    renderCart(cartRefs);
    btn.textContent = 'Agregado ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Agregar al pedido';
      btn.disabled = false;
    }, 900);
  });

  renderCatalog(dom.catalogGrid, dom.catalogEmpty);
}

/* ------------------------------------------------------------------ */
/* Carrito / calculadora de pedido                                     */
/* ------------------------------------------------------------------ */
function initCart() {
  dom.cartList.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'increase') changeQty(id, 1);
    if (action === 'decrease') changeQty(id, -1);
    if (action === 'remove') removeFromCart(id);
    renderCart(cartRefs);
  });

  dom.zoneSelect.addEventListener('change', (event) => {
    setDeliveryZone(event.target.value);
    renderCart(cartRefs);
  });

  dom.currencyToggle.addEventListener('click', async () => {
    dom.currencyToggle.disabled = true;
    dom.currencyToggle.textContent = 'Convirtiendo…';
    const currency = await toggleCurrency();
    renderCart(cartRefs);
    dom.currencyToggle.textContent = currency === 'EUR' ? 'Ver en USD' : 'Ver en EUR';
    dom.currencyToggle.disabled = false;
  });

  renderCart(cartRefs);
}

/* ------------------------------------------------------------------ */
/* Formulario de contacto: validación en tiempo real                   */
/* ------------------------------------------------------------------ */
function validateField(field) {
  const errorEl = qs(`[data-error-for="${field.name}"]`);
  let message = '';

  if (field.hasAttribute('required') && !field.value.trim()) {
    message = 'Este campo es obligatorio.';
  } else if (field.name === 'email' && field.value && !isValidEmail(field.value)) {
    message = 'Ingresa un correo válido, ej: nombre@correo.com';
  } else if (field.name === 'phone' && field.value && !isValidPhone(field.value)) {
    message = 'Ingresa un teléfono válido (7 a 10 dígitos).';
  } else if (field.name === 'message' && field.value && field.value.trim().length < 10) {
    message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
  }

  if (errorEl) {
    errorEl.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
  return message === '';
}

function initContactForm() {
  const fields = qsa('input, textarea', dom.contactForm);

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  dom.contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const allValid = fields.map((field) => validateField(field)).every(Boolean);

    if (!allValid) {
      setStatusMessage(dom.formStatus, 'Revisa los campos marcados en rojo antes de enviar.', 'error');
      return;
    }

    setStatusMessage(dom.formStatus, '¡Mensaje enviado! Te contactaremos muy pronto. ☕', 'success');
    dom.contactForm.reset();
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
  });
}

/* ------------------------------------------------------------------ */
/* Navegación móvil + animaciones al hacer scroll                      */
/* ------------------------------------------------------------------ */
function initNav() {
  dom.navToggle.addEventListener('click', () => {
    const isOpen = dom.nav.classList.toggle('is-open');
    dom.navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  qsa('#nav-menu a').forEach((link) =>
    link.addEventListener('click', () => {
      dom.nav.classList.remove('is-open');
      dom.navToggle.setAttribute('aria-expanded', 'false');
    }),
  );
}

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = qsa('[data-reveal]');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  revealEls.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Arranque                                                             */
/* ------------------------------------------------------------------ */
function init() {
  dom.yearEl.textContent = new Date().getFullYear();
  initNav();
  initHero();
  initCatalog();
  initCart();
  initContactForm();
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', init);
