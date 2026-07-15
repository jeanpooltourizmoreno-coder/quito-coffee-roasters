# ☕ Quito Coffee Roasters — Dashboard Web Interactivo

Aplicación web para una tostadería artesanal del Centro Histórico de Quito. Permite explorar el catálogo de cafés de especialidad, calcular el costo de envío según la zona de entrega y contactar a la tienda — todo sin pasar por WhatsApp.

Proyecto final del curso **Ruta de la Empleabilidad** (Conquito).

## 🔗 Demo en vivo

> Reemplazar con el enlace real una vez desplegado en GitHub Pages:
> `https://<tu-usuario>.github.io/quito-coffee-roasters/`

## ✨ Características

- **Catálogo dinámico** de 9 lotes de café con búsqueda por nombre y filtro por origen (Ecuador, Colombia, Brasil, Etiopía).
- **Medidor de perfil de tueste** (claro / medio / oscuro) en cada tarjeta de producto.
- **Carrito de pedido** con cantidades editables, cálculo automático de subtotal, envío y total según la zona de entrega en Quito.
- **Conversión de moneda** USD ↔ EUR con un clic.
- **Clima actual de Quito** y **frase del día**, consumidos en vivo desde APIs públicas.
- **Formulario de contacto** con validación en tiempo real campo por campo.
- Diseño **100% responsive** (móvil, tablet, escritorio), animaciones sutiles y soporte para `prefers-reduced-motion`.


## 🌐 APIs consumidas

| API | Uso en el proyecto | Documentación |
|---|---|---|
| **Open-Meteo** | Clima actual de Quito en el hero | https://open-meteo.com |
| **Quotable** | Frase inspiracional del día (con respaldo local si la API no responde) | https://api.quotable.io |
| **Open Exchange Rate (ExchangeRate-API)** | Conversión de precios USD → EUR en la calculadora | https://www.exchangerate-api.com |

Las tres integraciones tienen manejo de errores con `try/catch`, tiempo límite de espera (`AbortController`) y un valor de respaldo para que la interfaz nunca se quede rota si una API externa falla.

## 📁 Estructura del proyecto

```
quito-coffee-roasters/
├── index.html
├── README.md
├── css/
│   └── style.css
├── data/
│   └── coffees.js        # Catálogo de cafés y zonas de entrega
├── js/
│   ├── api.js             # Consumo de Open-Meteo, Quotable y ExchangeRate-API
│   ├── cart.js             # Estado del carrito y calculadora de pedido
│   ├── main.js              # Punto de entrada: conecta todo con el DOM
│   ├── products.js           # Renderizado, filtro y búsqueda del catálogo
│   └── utils.js               # Helpers genéricos (formato, validación, DOM)
└── images/
```

## 🚀 Uso local

1. Cloná o descargá este repositorio.
2. Abrí `index.html` con la extensión **Live Server** de VS Code (los módulos ES6 necesitan servirse por `http://`, no funcionan con `file://`).
3. Listo — no requiere instalación de dependencias ni build step.

## ☁️ Despliegue en GitHub Pages

1. Subí todos los archivos a un repositorio público de GitHub.
2. Andá a **Settings → Pages → Source** y seleccioná la rama `main`.
3. Esperá unos minutos y verificá la URL pública generada.

## 🤖 Uso documentado de IA

Este proyecto se desarrolló con ayuda de Claude (Anthropic) como asistente de programación. Algunos de los prompts utilizados:

1. "Necesito ayuda para crear el código de una página web creativa e interactiva sobre este caso de negocio, ya tengo esta estructura de carpetas."
2. "Diseñá una paleta y tipografía para un tostadero de café que no se vea genérica."
3. "Armá la lógica del carrito de compras con cálculo de subtotal, envío por zona y total."
4. "Agregá manejo de errores con try/catch y un valor de respaldo si la API del clima o de la frase del día no responden."
5. "Revisá que la validación del formulario de contacto sea en tiempo real y accesible."

> Completá o ajustá esta lista con tus propios prompts reales si seguiste conversando con el asistente para modificar el proyecto.


## 👤 Autor/a

**[jean pool touriz moreno]** — Ruta de la Empleabilidad, Conquito, 2026.
