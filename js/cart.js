/**
 * js/cart.js
 * ------------------------------------------------------------------
 * Estado y lógica del carrito de compras + calculadora de pedido.
 * Este módulo no toca el DOM directamente salvo en renderCart(),
 * que recibe los elementos ya resueltos por main.js (inversión de
 * control: cart.js no necesita conocer los selectores de la página).
 * ------------------------------------------------------------------ */

import { DELIVERY_ZONES } from '../data/coffees.js';
import { formatCurrency } from './utils.js';
import { getUsdToEurRate } from './api.js';

/** Estado interno del carrito: Map<id, {coffee, qty}> */
const cartState = new Map();

/** Zona de entrega seleccionada (por defecto: Centro). */
let selectedZoneId = 'centro';

/** Moneda de visualización del total ('USD' | 'EUR'). */
let displayCurrency = 'USD';
let cachedEurRate = null;

export function addToCart(coffee) {
  const existing = cartState.get(coffee.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.set(coffee.id, { coffee, qty: 1 });
  }
}

export function removeFromCart(id) {
  cartState.delete(id);
}

export function changeQty(id, delta) {
  const item = cartState.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cartState.delete(id);
}

export function setDeliveryZone(zoneId) {
  selectedZoneId = zoneId;
}

export function getSelectedZone() {
  return DELIVERY_ZONES.find((zone) => zone.id === selectedZoneId) ?? DELIVERY_ZONES[0];
}

export function getCartItems() {
  return [...cartState.values()];
}

export function getItemCount() {
  return getCartItems().reduce((total, { qty }) => total + qty, 0);
}

/** Subtotal = suma de (precio * cantidad) de cada línea del carrito. */
export function getSubtotal() {
  return getCartItems().reduce((total, { coffee, qty }) => total + coffee.price * qty, 0);
}

export function getShippingCost() {
  return cartState.size === 0 ? 0 : getSelectedZone().cost;
}

export function getTotal() {
  return getSubtotal() + getShippingCost();
}

export async function toggleCurrency() {
  if (displayCurrency === 'USD') {
    if (cachedEurRate === null) {
      const result = await getUsdToEurRate();
      cachedEurRate = result.rate;
    }
    displayCurrency = 'EUR';
  } else {
    displayCurrency = 'USD';
  }
  return displayCurrency;
}

export function getDisplayCurrency() {
  return displayCurrency;
}

/** Convierte un monto en USD a la moneda de visualización activa. */
export function toDisplayAmount(usdAmount) {
  if (displayCurrency === 'EUR' && cachedEurRate) {
    return usdAmount * cachedEurRate;
  }
  return usdAmount;
}

/**
 * Pinta el carrito completo dentro de los elementos entregados por main.js.
 * @param {Object} refs - { listEl, subtotalEl, shippingEl, totalEl, countEl, emptyEl }
 */
export function renderCart(refs) {
  const { listEl, subtotalEl, shippingEl, totalEl, countEl, emptyEl } = refs;
  const items = getCartItems();
  const currency = displayCurrency;

  listEl.innerHTML = '';
  emptyEl.hidden = items.length > 0;

  items.forEach(({ coffee, qty }) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item__info">
        <p class="cart-item__name">${coffee.flag} ${coffee.name}</p>
        <p class="cart-item__price">${formatCurrency(toDisplayAmount(coffee.price), currency)} c/u</p>
      </div>
      <div class="cart-item__qty" role="group" aria-label="Cantidad de ${coffee.name}">
        <button type="button" class="qty-btn" data-action="decrease" data-id="${coffee.id}" aria-label="Quitar una unidad">−</button>
        <span aria-live="polite">${qty}</span>
        <button type="button" class="qty-btn" data-action="increase" data-id="${coffee.id}" aria-label="Agregar una unidad">+</button>
      </div>
      <button type="button" class="cart-item__remove" data-action="remove" data-id="${coffee.id}" aria-label="Eliminar ${coffee.name} del pedido">✕</button>
    `;
    listEl.appendChild(li);
  });

  subtotalEl.textContent = formatCurrency(toDisplayAmount(getSubtotal()), currency);
  shippingEl.textContent = formatCurrency(toDisplayAmount(getShippingCost()), currency);
  totalEl.textContent = formatCurrency(toDisplayAmount(getTotal()), currency);
  countEl.textContent = getItemCount();
}
