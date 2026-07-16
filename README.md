# Mundo Tech — Back-office Editorial

Plataforma editorial para la gestión de artículos de Mundo Tech. Permite a autores redactar y enviar contenidos, y a managers revisarlos, publicarlos o rechazarlos.

## Equipo de desarrollo

| Nombre | Rol | GitHub |
|---|---|---|
| Damaris Castro | Developer | [@damcb1](https://github.com/damcb1) |
| Ivanna Caraccio | Developer | [@IvannaRCA](https://github.com/IvannaRCA) |
| Rosa Maria Naharro| Developer & Scrum Master | [@rosana50factoria](https://github.com/orgs/Cinephile-Team-2/people/rosana50factoria) |
| Andrea Tapia | Developer & Product Owner  | [@atapiamallea](https://github.com/atapiamallea) |

---


Repositorios:

- **Frontend:** [https://github.com/Periodico-Mundo-Tech-Team-3/mundo-tech-frontend]
- **Backend:** [https://github.com/Periodico-Mundo-Tech-Team-3/mundo-tech-backend]

## Tech Stack

React 19 · Vite 8 · Sass · React Router 6 · Axios · Lucide React · Vitest

## Requisitos

Node 18+ y backend Java disponible (por defecto en `localhost:8080`)

## Instalación

```bash
git clone [url]
cd mundo-tech-frontend
npm install
cp .env.example .env
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:5173` |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Vitest en modo watch |
| `npm run test:run` | Vitest ejecución única |

## Usuarios mock (desarrollo)

7 usuarios precargados. Ver `src/mocks/users.js` para el listado completo.

| Usuario | Email | Password | Roles |
|---|---|---|---|
| Sofía Lambert | sofia@mundotech.com | hola7878 | author, manager |
| Marta Ruiz | marta@mundotech.com | hola1234 | manager |
| Carlos Peña | carlos@mundotech.com | hola9876 | author |

> En desarrollo el sistema carga automáticamente el último usuario autenticado guardado en localStorage.

## Roles y permisos

La lógica está centralizada en `src/utils/permissions.js`.

| Permiso | Condición |
|---|---|
| `canAccessRedaction` | Usuario con rol `author` |
| `canAccessEditorial` | Usuario con rol `manager` |
| `canEdit` / `canDelete` | Dueño del artículo |
| `canSendToReview` | Dueño + status `DRAFT` |
| `canPublish` / `canReject` | Manager + status `IN_REVIEW` |

## Flujo de artículos

```
DRAFT ──(sendToReview)──▶ IN_REVIEW ──(publish)──▶ PUBLISHED
                                │
                                └──(reject)──▶ (vuelve a DRAFT del autor)
```

## Estructura del proyecto

```
src/
├── components/
│   ├── common/     # Button, Card, Input, Modal, Table, Tabs, StatusBadge...
│   ├── article/    # ArticleCard, ArticleRowActions, ImageUploader
│   └── layout/     # Sidebar, Topbar
├── context/        # AuthContext, ThemeContext
├── pages/
│   ├── Login/              # Pantalla de login
│   ├── MyArticles/         # Lista de artículos del autor (tabs por status)
│   ├── NewArticleForm/     # Crear/editar artículo (multipart)
│   ├── ArticlePreview/     # Vista previa antes de enviar a revisión
│   ├── ArticlesInReview/   # Cola de revisión del manager
│   └── ArticlesPublished/  # Artículos publicados (manager)
├── routes/         # AppRouter, ProtectedRoute
├── services/       # api.js (axios), articleService.js, userService.js
├── utils/          # permissions.js, formatDate.js
├── mocks/          # users.js (datos de desarrollo)
├── layouts/        # MainLayout (Sidebar + Topbar + contenido)
└── styles/         # main.scss, variables, mixins, tema claro/oscuro
```

## API consumida

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/articles` | Listar todos los artículos |
| `GET` | `/api/v1/articles/:id` | Obtener artículo por ID |
| `GET` | `/api/v1/articles/status?status=X&userId=Y` | Filtrar por estado |
| `GET` | `/api/v1/articles/author?authorId=X` | Filtrar por autor |
| `POST` | `/api/v1/articles/:userId` | Crear artículo (multipart) |
| `PUT` | `/api/v1/articles/:id/:userId` | Actualizar artículo (multipart) |
| `DELETE` | `/api/v1/articles/:id/:userId` | Eliminar artículo |
| `GET` | `/api/v1/articles/:id/submit?userId=X` | Enviar a revisión |
| `GET` | `/api/v1/articles/:id/publish?userId=X` | Publicar |
| `GET` | `/api/v1/articles/:id/reject?userId=X` | Rechazar |
| `DELETE` | `/api/v1/users/:userId` | Eliminar cuenta |

## Tests

Vitest + jsdom + Testing Library. **87 tests** en 6 archivos.

```
test/
├── setup.js                  # Configuración global (jest-dom, localStorage)
├── permissions.test.js       # 39 tests — lógica de permisos
├── formatDate.test.js        #  9 tests — formateo de fechas en español
├── users.test.js             # 11 tests — integridad de datos mock
├── AuthContext.test.jsx      # 11 tests — login, logout, deleteAccount, persistencia
├── articleService.test.js    # 12 tests — URLs, métodos y parámetros de cada endpoint
└── ProtectedRoute.test.jsx   #  5 tests — redirección según autenticación y permisos
```

Ejecutar:

```bash
npm test           # modo watch
npm run test:run   # ejecución única
```
