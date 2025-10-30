# embutidos-rb

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## File Structure

```
my-app/
├── public/
│ ├── favicon.ico
│ └── robots.txt
│
├── src/
│ ├── assets/
│ │ ├── images/
│ │ │ ├── logo.png
│ │ │ └── icons/
│ │ ├── styles/
│ │ │ ├── main.scss
│ │ │ ├── variables.scss
│ │ │ ├── mixins.scss
│ │ │ └── reset.scss
│ │ └── fonts/
│ │
│ ├── components/
│ │ ├── common/
│ │ │ ├── BaseButton.vue
│ │ │ ├── BaseInput.vue
│ │ │ ├── BaseModal.vue
│ │ │ ├── BaseTable.vue
│ │ │ └── BaseCard.vue
│ │ ├── layout/
│ │ │ ├── TheHeader.vue
│ │ │ ├── TheSidebar.vue
│ │ │ ├── TheFooter.vue
│ │ │ └── TheNavbar.vue
│ │ └── features/
│ │ ├── user/
│ │ │ ├── UserProfile.vue
│ │ │ ├── UserAvatar.vue
│ │ │ └── UserSettings.vue
│ │ ├── product/
│ │ │ ├── ProductCard.vue
│ │ │ ├── ProductList.vue
│ │ │ └── ProductFilter.vue
│ │ └── order/
│ │ ├── OrderSummary.vue
│ │ └── OrderStatus.vue
│ │
│ ├── views/
│ │ ├── HomeView.vue
│ │ ├── AboutView.vue
│ │ ├── auth/
│ │ │ ├── LoginView.vue
│ │ │ ├── RegisterView.vue
│ │ │ └── ForgotPasswordView.vue
│ │ ├── dashboard/
│ │ │ ├── DashboardView.vue
│ │ │ └── AnalyticsView.vue
│ │ ├── user/
│ │ │ ├── UserProfileView.vue
│ │ │ ├── UsersView.vue
│ │ │ └── UserDetailView.vue
│ │ ├── product/
│ │ │ ├── ProductsView.vue
│ │ │ ├── ProductDetailView.vue
│ │ │ └── ProductCreateView.vue
│ │ └── ErrorView.vue
│ │
│ ├── router/
│ │ ├── index.js
│ │ ├── guards.js
│ │ └── routes/
│ │ ├── auth.js
│ │ ├── dashboard.js
│ │ ├── user.js
│ │ └── product.js
│ │
│ ├── store/
│ │ ├── index.js
│ │ └── modules/
│ │ ├── auth.js
│ │ ├── user.js
│ │ ├── product.js
│ │ ├── cart.js
│ │ └── notification.js
│ │
│ ├── composables/
│ │ ├── useAuth.js
│ │ ├── useApi.js
│ │ ├── useForm.js
│ │ ├── usePagination.js
│ │ ├── useDebounce.js
│ │ └── usePermissions.js
│ │
│ ├── services/
│ │ ├── api/
│ │ │ ├── client.js
│ │ │ ├── auth.service.js
│ │ │ ├── user.service.js
│ │ │ ├── product.service.js
│ │ │ └── order.service.js
│ │ ├── storage/
│ │ │ └── localStorage.js
│ │ └── analytics/
│ │ └── analytics.service.js
│ │
│ ├── utils/
│ │ ├── validators.js
│ │ ├── formatters.js
│ │ ├── constants.js
│ │ ├── helpers.js
│ │ └── date.js
│ │
│ ├── plugins/
│ │ ├── i18n.js
│ │ ├── axios.js
│ │ └── vee-validate.js
│ │
│ ├── middleware/
│ │ ├── auth.js
│ │ └── permissions.js
│ │
│ ├── directives/
│ │ ├── click-outside.js
│ │ ├── tooltip.js
│ │ └── permission.js
│ │
│ ├── filters/
│ │ └── currency.js
│ │
│ ├── locales/
│ │ ├── en.json
│ │ ├── es.json
│ │ └── index.js
│ │
│ ├── types/
│ │ ├── user.types.js
│ │ ├── product.types.js
│ │ └── api.types.js
│ │
│ ├── config/
│ │ ├── app.config.js
│ │ └── api.config.js
│ │
│ ├── layouts/
│ │ ├── DefaultLayout.vue
│ │ ├── AuthLayout.vue
│ │ └── DashboardLayout.vue
│ │
│ ├── App.vue
│ └── main.js
│
├── tests/
│ ├── unit/
│ │ ├── components/
│ │ ├── composables/
│ │ └── utils/
│ ├── e2e/
│ │ └── specs/
│ └── setup.js
│
├── .env
├── .env.production
├── .env.development
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── vite.config.js
├── package.json
└── README.md
```

### Explicación de cada carpeta

#### assets/

Recursos estáticos: imágenes, estilos globales, fuentes.

#### components/

common/: Componentes reutilizables base (botones, inputs, modales)

layout/: Componentes de estructura (header, sidebar, footer)

features/: Componentes específicos agrupados por funcionalidad

#### views/

Componentes de página, organizados por módulos/características.

#### router/

Configuración de rutas dividida en archivos por módulo, guards de navegación.

#### store/

Vuex o Pinia, dividido en módulos por dominio.

#### composables/

Lógica reutilizable con Composition API (equivalente a hooks en React).

#### services/

Lógica de negocio y llamadas a APIs, organizada por recurso.

#### utils/

Funciones helper, validadores, formateadores, constantes.

#### plugins/

Configuración de librerías externas (i18n, axios, etc.).

#### middleware/

Lógica que se ejecuta antes de entrar a rutas.

#### directives/

Directivas personalizadas de Vue.

#### locales/

Archivos de traducción para i18n.

#### types/

Definiciones de tipos (útil si usas TypeScript).

#### config/

Configuraciones centralizadas de la app.

#### layouts/

Templates de diseño que envuelven las views.
