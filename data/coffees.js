/**
 * data/coffees.js
 * ------------------------------------------------------------------
 * Catálogo de cafés de especialidad de Quito Coffee Roasters.
 * Cada objeto representa un lote disponible. `roast` usa una escala
 * real de tueste (claro -> medio -> oscuro) que se reutiliza en la UI
 * para pintar la barra de "perfil de tueste" de cada tarjeta.
 * ------------------------------------------------------------------
 */

export const ROAST_LEVELS = ['claro', 'medio', 'oscuro'];

export const coffees = [
  {
    id: 'qcr-001',
    name: 'Quito Amanecer',
    origin: 'Ecuador',
    region: 'Intag',
    notes: ['panela', 'mandarina', 'cacao'],
    roast: 'medio',
    price: 14.50,
    flag: '🇪🇨',
  },
  {
    id: 'qcr-002',
    name: 'Cielo Andino',
    origin: 'Ecuador',
    region: 'Loja',
    notes: ['caramelo', 'manzana verde', 'floral'],
    roast: 'claro',
    price: 15.90,
    flag: '🇪🇨',
  },
  {
    id: 'qcr-003',
    name: 'Volcán Negro',
    origin: 'Ecuador',
    region: 'Pichincha',
    notes: ['chocolate amargo', 'nuez', 'ciruela'],
    roast: 'oscuro',
    price: 13.20,
    flag: '🇪🇨',
  },
  {
    id: 'qcr-004',
    name: 'Huila Dorado',
    origin: 'Colombia',
    region: 'Huila',
    notes: ['caramelo', 'cítricos', 'almendra'],
    roast: 'medio',
    price: 16.00,
    flag: '🇨🇴',
  },
  {
    id: 'qcr-005',
    name: 'Nariño Brisa',
    origin: 'Colombia',
    region: 'Nariño',
    notes: ['uva', 'panela', 'jazmín'],
    roast: 'claro',
    price: 16.80,
    flag: '🇨🇴',
  },
  {
    id: 'qcr-006',
    name: 'Cerrado Intenso',
    origin: 'Brasil',
    region: 'Cerrado Mineiro',
    notes: ['chocolate con leche', 'avellana', 'especias'],
    roast: 'oscuro',
    price: 12.50,
    flag: '🇧🇷',
  },
  {
    id: 'qcr-007',
    name: 'Sul de Minas',
    origin: 'Brasil',
    region: 'Minas Gerais',
    notes: ['nuez', 'caramelo', 'baja acidez'],
    roast: 'medio',
    price: 12.90,
    flag: '🇧🇷',
  },
  {
    id: 'qcr-008',
    name: 'Yirgacheffe Floral',
    origin: 'Etiopía',
    region: 'Yirgacheffe',
    notes: ['jazmín', 'bergamota', 'té negro'],
    roast: 'claro',
    price: 18.50,
    flag: '🇪🇹',
  },
  {
    id: 'qcr-009',
    name: 'Sidamo Salvaje',
    origin: 'Etiopía',
    region: 'Sidamo',
    notes: ['arándano', 'vino', 'chocolate'],
    roast: 'medio',
    price: 17.90,
    flag: '🇪🇹',
  },
];

/** Zonas de entrega en Quito y su costo fijo de envío (USD). */
export const DELIVERY_ZONES = [
  { id: 'norte', label: 'Norte', cost: 2.50 },
  { id: 'centro', label: 'Centro', cost: 1.80 },
  { id: 'sur', label: 'Sur', cost: 3.00 },
  { id: 'valles', label: 'Valles', cost: 3.50 },
];
