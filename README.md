# 📰 Mundo Tech — Editorial Back-Office

Editorial platform for managing Mundo Tech articles. Allows authors to write and submit content, and managers to review, publish, or reject it.

## 👥 Development Team

| Name | Role | GitHub |
|---|---|---|
| Damaris Castro | Developer | [@damcb1](https://github.com/damcb1) |
| Ivanna Caraccio | Developer | [@IvannaRCA](https://github.com/IvannaRCA) |
| Rosa Maria Naharro| Developer & Scrum Master | [@rosana50factoria](https://github.com/orgs/Cinephile-Team-2/people/rosana50factoria) |
| Andrea Tapia | Developer & Product Owner  | [@atapiamallea](https://github.com/atapiamallea) |

---

Repositories:

- **Frontend:** [https://github.com/Periodico-Mundo-Tech-Team-3/mundo-tech-frontend]
- **Backend:** [https://github.com/Periodico-Mundo-Tech-Team-3/mundo-tech-backend]

## 🛠️ Tech Stack

React 19 · Vite 8 · Sass · React Router 6 · Axios · Lucide React · Vitest

## 📋 Requirements

Node 18+ and a running Java backend (default at `localhost:8080`)

## 💿 Installation

```bash
git clone [url]
cd mundo-tech-frontend
npm install
cp .env.example .env
```

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server at `localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the build |
| `npm run lint` | Run ESLint |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest single run |

## 🧪 Mock Users (Development)

7 preloaded users. See `src/mocks/users.js` for the full list.

| User | Email | Password | Roles |
|---|---|---|---|
| Sofía Lambert | sofia@mundotech.com | hola7878 | author, manager |
| Marta Ruiz | marta@mundotech.com | hola1234 | manager |
| Carlos Peña | carlos@mundotech.com | hola9876 | author |

> In development, the system automatically loads the last authenticated user saved in localStorage.

## 🔐 Roles & Permissions

Logic is centralized in `src/utils/permissions.js`.

| Permission | Condition |
|---|---|
| `canAccessRedaction` | User with `author` role |
| `canAccessEditorial` | User with `manager` role |
| `canEdit` / `canDelete` | Article owner |
| `canSendToReview` | Owner + `DRAFT` status |
| `canPublish` / `canReject` | Manager + `IN_REVIEW` status |

## 📄 Article Workflow

```
DRAFT ──(sendToReview)──▶ IN_REVIEW ──(publish)──▶ PUBLISHED
                                │
                                └──(reject)──▶ (returns to author's DRAFT)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/     # Button, Card, Input, Modal, Table, Tabs, StatusBadge...
│   ├── article/    # ArticleCard, ArticleRowActions, ImageUploader
│   └── layout/     # Sidebar, Topbar
├── context/        # AuthContext, ThemeContext
├── pages/
│   ├── Login/              # Login screen
│   ├── MyArticles/         # Author's article list (tabs by status)
│   ├── NewArticleForm/     # Create/edit article (multipart)
│   ├── ArticlePreview/     # Preview before sending to review
│   ├── ArticlesInReview/   # Manager's review queue
│   └── ArticlesPublished/  # Published articles (manager)
├── routes/         # AppRouter, ProtectedRoute
├── services/       # api.js (axios), articleService.js, userService.js
├── utils/          # permissions.js, formatDate.js
├── mocks/          # users.js (development data)
├── layouts/        # MainLayout (Sidebar + Topbar + content)
└── styles/         # main.scss, variables, mixins, light/dark theme
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/articles` | List all articles |
| `GET` | `/api/v1/articles/:id` | Get article by ID |
| `GET` | `/api/v1/articles/status?status=X&userId=Y` | Filter by status |
| `GET` | `/api/v1/articles/author?authorId=X` | Filter by author |
| `POST` | `/api/v1/articles/:userId` | Create article (multipart) |
| `PUT` | `/api/v1/articles/:id/:userId` | Update article (multipart) |
| `DELETE` | `/api/v1/articles/:id/:userId` | Delete article |
| `GET` | `/api/v1/articles/:id/submit?userId=X` | Submit for review |
| `GET` | `/api/v1/articles/:id/publish?userId=X` | Publish |
| `GET` | `/api/v1/articles/:id/reject?userId=X` | Reject |
| `DELETE` | `/api/v1/users/:userId` | Delete account |

## ✅ Tests

Vitest + jsdom + Testing Library. **87 tests** across 6 files.

```
test/
├── setup.js                  # Global setup (jest-dom, localStorage)
├── permissions.test.js       # 39 tests — permission logic
├── formatDate.test.js        #  9 tests — Spanish date formatting
├── users.test.js             # 11 tests — mock data integrity
├── AuthContext.test.jsx      # 11 tests — login, logout, deleteAccount, persistence
├── articleService.test.js    # 12 tests — URLs, methods, and parameters per endpoint
└── ProtectedRoute.test.jsx   #  5 tests — redirect based on auth and permissions
```

Run:

```bash
npm test           # watch mode
npm run test:run   # single run
```
