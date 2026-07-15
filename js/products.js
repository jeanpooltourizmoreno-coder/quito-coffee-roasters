/**
 * js/products.js
 * ------------------------------------------------------------------
 * Renderizado del catálogo: pinta tarjetas de café, aplica filtro por
 * origen y búsqueda por nombre. La lista visible se recalcula con
 * filter()/find() cada vez que cambia un criterio, nunca se muta el
 * arreglo original `coffees`.
 * ------------------------------------------------------------------ */

import { coffees } from '../data/coffees.js';
import { formatCurrency, createEl } from './utils.js';

let activeOrigin = 'todos';
let activeQuery = '';

const ROAST_LABELS = { claro: 'Claro', medio: 'Medio', oscuro: 'Oscuro' };

export function setOriginFilter(origin) {
  activeOrigin = origin;
}

export function setSearchQuery(query) {
  activeQuery = query.trim().toLowerCase();
}

/** Devuelve la lista de cafés visibles según el origen y la búsqueda activos. */
export function getVisibleCoffees() {
  return coffees
    .filter((coffee) => activeOrigin === 'todos' || coffee.origin === activeOrigin)
    .filter((coffee) => coffee.name.toLowerCase().includes(activeQuery));
}

/** Construye el nodo <article> de una tarjeta de café. */
function buildCoffeeCard(coffee) {
  const card = createEl('article', {
    classes: ['coffee-card'],
    attrs: { 'data-id': coffee.id, tabindex: '0', 'aria-label': `${coffee.name}, origen ${coffee.origin}` },
  });

  const roastIndex = ['claro', 'medio', 'oscuro'].indexOf(coffee.roast);

  card.innerHTML = `
    <div class="coffee-card__stamp coffee-card__stamp--${coffee.roast}" aria-hidden="true">
      <span>${coffee.flag}</span>
    </div>
    <div class="coffee-card__body">
      <p class="coffee-card__origin">${coffee.origin} · ${coffee.region}</p>
      <h3 class="coffee-card__name">${coffee.name}</h3>
      <ul class="coffee-card__notes" aria-label="Notas de cata">
        ${coffee.notes.map((note) => `<li>${note}</li>`).join('')}
      </ul>
      <div class="roast-meter" role="img" aria-label="Nivel de tueste: ${ROAST_LABELS[coffee.roast]}">
        <span class="roast-meter__label">Claro</span>
        <div class="roast-meter__track">
          <div class="roast-meter__fill" style="--roast-step:${roastIndex}"></div>
        </div>
        <span class="roast-meter__label">Oscuro</span>
      </div>
      <div class="coffee-card__footer">
        <span class="coffee-card__price">${formatCurrency(coffee.price)}</span>
        <button type="button" class="btn btn--add" data-action="add-to-cart" data-id="${coffee.id}">
          Agregar al pedido
        </button>
      </div>
    </div>
  `;
  return card;
}

/** Vuelve a pintar el grid completo del catálogo dentro de gridEl. */
export function renderCatalog(gridEl, emptyStateEl) {
  const visible = getVisibleCoffees();
  gridEl.innerHTML = '';
  emptyStateEl.hidden = visible.length > 0;
  visible.forEach((coffee) => gridEl.appendChild(buildCoffeeCard(coffee)));
}

/** Lista única de orígenes disponibles, calculada con reduce (sin duplicados). */
export function getAvailableOrigins() {
  return coffees.reduce((origins, coffee) => {
    if (!origins.includes(coffee.origin)) origins.push(coffee.origin);
    return origins;
  }, []);
}

export function findCoffeeById(id) {
  return coffees.find((coffee) => coffee.id === id);
}
