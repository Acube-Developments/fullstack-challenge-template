# Fullstack Challenge — Task Board

A small but realistic fullstack app: a **NestJS + Prisma** API and a **React + Vite**
task board that talks to it. The app runs, but it ships with one real bug and one
missing feature. Your job is to fix the bug, build the feature, and prove both with tests.

> This is a take-home / evaluation starter. The codebase is intentionally ordinary —
> no exotic frameworks — but it does **not** hand-hold. Read the code before you change it.

---

## Tech stack

| Layer    | Tech                                        |
| -------- | ------------------------------------------- |
| Backend  | NestJS 10, Prisma 5, SQLite, class-validator |
| Frontend | React 18, Vite 5, TypeScript                |
| Tests    | Jest + ts-jest (backend)                    |

```
fullstack-challenge-template/
├── backend/                 # NestJS API (served under /api)
│   ├── prisma/schema.prisma # Task model
│   └── src/
│       ├── main.ts          # global prefix, validation, CORS
│       ├── prisma/          # PrismaService (injectable)
│       └── tasks/           # controller, service, DTOs
└── frontend/                # React + Vite task board
    └── src/
        ├── api.ts           # typed API client
        └── App.tsx          # task board UI
```

---

## Getting started

Requires **Node 18+** (Node 20/22 recommended).

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev      # creates SQLite db + generates the Prisma client
npm run start:dev           # http://localhost:3000/api
```

Quick smoke test:

```bash
# list tasks
curl http://localhost:3000/api/tasks

# create a task (with a description — works)
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write docs","description":"Document the API"}'
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxies /api -> :3000)
```

Open http://localhost:5173 and you'll see the task board. The dev server proxies
`/api` to the backend, so start the backend first.

---

## The challenge

### 1. Get the project running

Clone this repo and bring up the backend and frontend as described above.

### 2. Fix the bug

**`POST /api/tasks` returns a `500` when the `description` field is missing.**

```bash
# this 500s today:
curl -i -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"No description here"}'
```

Creating a task *without* a description is supposed to be allowed (the field is optional
in both the UI and the validation layer). Identify the **root cause** and fix it **properly
in the NestJS service layer** — not by papering over it at the validation or HTTP layer.
A task created without a description should be saved successfully and return `201`.

### 3. Add a feature

Implement **`PATCH /api/tasks/:id/complete`** that marks a task as complete.

- Add the necessary **Prisma migration**.
- Add the **service logic**.
- Wire up the **controller** route.
- Requesting a non-existent task id should return `404`.

The React task board already has a **"Mark complete"** button that calls this endpoint —
it returns `404` until you build it. When you're done, the button should work end to end.

### 4. Write tests

Add **at least 2 unit tests** for the task service using **Jest**:

- one that covers the **bug fix** (creating a task with no description succeeds), and
- one that covers the **new complete endpoint** logic.

Mock Prisma so the tests don't need a live database. Run them with `npm test` in `backend/`.

### 5. Publish your work

Push your changes to a **public GitHub repository** and share the link.

---

## What we're looking at

- Did you find the **actual root cause** of the 500, or just silence the symptom?
- Is the fix in the **right layer**?
- Does the new endpoint behave correctly for the happy path **and** edge cases (missing id)?
- Are the tests meaningful (do they fail before your fix / feature and pass after)?
- Clean, idiomatic NestJS — no dead code, no hallucinated APIs.

Good luck.
