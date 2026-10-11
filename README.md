# PDF Parser — Intelligent PDF Assistant

A React + Vite dashboard for uploading documents and asking questions about them, with cookie-based authentication, protected routes, and a Tailwind CSS UI. Wired directly to your `userRoute.js` / `pdfRoute.js` backend.

## Stack

- React 18 + React Router v6
- Tailwind CSS
- Axios (`withCredentials: true` — the backend uses an httpOnly cookie, not Bearer tokens)
- react-hot-toast (notifications)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

Set your backend base URL in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

This should match wherever you mounted the routers, e.g.:

```js
app.use("/api/user", userRoute)
app.use("/api/pdf", pdfRoute)
```

### Backend CORS requirement

Because auth is a cookie (`pdfmindtoken`, httpOnly), your Express server must allow credentials from the frontend's origin:

```js
app.use(cors({
  origin: "http://localhost:5173", // your Vite dev URL
  credentials: true,
}))
```

Without `credentials: true` on both the server's CORS config and the client's axios instance, the cookie will never be sent/set and every request will 401.

## API surface this frontend integrates (only what exists on your backend)

**Auth** (`userRoute.js`)
- `POST /user/register` `{ name, email, password }`
- `POST /user/login` `{ email, password }` → sets `pdfmindtoken` cookie, returns `{ user }`
- `GET /user/verify` (protected) → confirms the cookie is valid

There is **no logout endpoint**. Since the cookie is httpOnly, the frontend can't clear it directly — "Sign out" in the UI only resets local state. Add something like `POST /user/logout` that does `res.clearCookie("pdfmindtoken")` if you want a real sign-out.

There is also **no forgot/reset-password or profile-update endpoint**, so those pages/flows were removed from the UI (Settings shows account info read-only, with a note).

**Documents** (`pdfRoute.js`)
- `POST /pdf/upload` (protected, multipart field `file`) — PDF, DOCX, or TXT, max 10MB
- `POST /pdf/ask` (protected) `{ docId, question }` → answer
- `GET /pdf/documents` (protected) → list
- `GET /pdf/documents/:docId` (protected) → single document

There's no delete, separate "parse", export, or stats endpoint, so those actions aren't in the UI. The document detail page (`PdfDetails.jsx`) shows the file plus an "Ask this document" chat panel backed by `/pdf/ask`.

## Response shape flexibility

The frontend reads a few possible field names defensively (`document ?? file ?? data`, `_id ?? id ?? docId`, `name ?? originalName ?? filename`) since the exact shape returned by `uploadDcoument`/`askQuestion` controllers wasn't specified. If your actual response keys differ, adjust the mapping in:
- `src/context/PdfContext.jsx`
- `src/components/pdf/PdfPreview.jsx`

## Project structure

```
src/
├── components/
│   ├── common/        Button, Input, Modal, Loader
│   ├── pdf/             PdfUploader, PdfViewer, PdfPreview, ParsedData (now the Q&A panel)
│   └── dashboard/       Sidebar, Navbar, RecentFiles, StatsCard
├── pages/
│   ├── auth/             SignIn, SignUp
│   ├── dashboard/        UserDashboard, MyFiles, UploadPdf, PdfDetails, Settings
│   └── NotFound.jsx
├── layouts/              AuthLayout, DashboardLayout
├── routes/               AppRoutes, ProtectedRoute
├── hooks/                useAuth, usePdfParser
├── context/              AuthContext, PdfContext
├── services/             api.js, authService.js, pdfService.js
├── utils/                fileUtils.js, pdfUtils.js
├── App.jsx
├── main.jsx
└── index.css
```

## Auth flow

1. On load, `AuthContext` calls `GET /user/verify`. If it succeeds, the user is treated as authenticated (using any cached profile info in `localStorage` for display, since `/verify` doesn't return the user object).
2. `SignIn` calls `POST /user/login`, which sets the cookie server-side and returns `{ user }`.
3. `SignUp` calls `POST /user/register`, then re-checks the session via `/user/verify` to detect whether registration also logs the user in.
4. `ProtectedRoute` redirects unauthenticated users to `/signin`, remembering where they were headed.
