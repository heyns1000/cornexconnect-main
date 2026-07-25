# Code Review — cornexconnect-main

Branch reviewed: `document-review` (clean working tree, unmodified)

## Summary

The frontend is genuinely strong: 34 pages, a complete shadcn/ui component set, i18n, and
framer-motion animation. The problems are all at the seam between that frontend and the
backend. As it stands the server cannot boot outside Replit, and most of its API surface is
disconnected from the app that calls it. These are structural issues, not cosmetic ones.

Every finding below was verified by running the code, not inferred by reading it.

---

## P0 — Blockers

### 1. The server cannot start outside Replit

`server/replitAuth.ts` throws at *module load time*:

```ts
// server/replitAuth.ts:11-13
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
```

`server/routes.ts:4` imports this module unconditionally, so the throw happens during import,
before the HTTP server ever calls `listen()`. Confirmed by running `tsx server/index.ts`:

```
Error: Environment variable REPLIT_DOMAINS not provided
    at server/replitAuth.ts:12
```

`REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` are Replit-specific as well. On Vercel, or on any
machine that is not Replit, this process dies on startup.

**Fix:** make the Replit auth strategy lazy or conditional so the module can be imported without
those variables present, and fall back to a portable session strategy.

### 2. 56 of 67 API endpoints are unreachable

Measured counts:

| Source | Distinct `/api/*` paths |
| --- | --- |
| Called by the client | 64 |
| Implemented by the live server | 11 |
| Present in `server/routes-broken.ts` | 67 |

`server/routes-broken.ts` holds 2,863 lines and 67 endpoints, but it is never imported anywhere
and does not compile. Whole features therefore have no backend at all: Purchase Orders, Factory
Setup, Automation, Route Management, Logistics, User Management, and Audit Trail.

### 3. The corruption has a single, small, precise cause

Two new handlers were pasted into the *middle* of the `/api/bulk-import/upload` handler, which
orphaned that handler's tail. The seam is visible at `routes-broken.ts:1278-1280`:

```ts
  });                                                  // line 1278: pasted handler closes here

      const jsonData = XLSX.utils.sheet_to_json(...)   // line 1280: stranded body, no enclosing fn
```

The stranded fragment spans roughly **lines 1279 to 1374** and is the sole source of all seven
TypeScript errors in the project:

```
routes-broken.ts(1337,11): error TS1005: 'try' expected.
routes-broken.ts(1347,7):  error TS1128: Declaration or statement expected.
routes-broken.ts(1370,5):  error TS1128: Declaration or statement expected.
routes-broken.ts(1370,7):  error TS1005: 'try' expected.
routes-broken.ts(1374,3):  error TS1128: Declaration or statement expected.
routes-broken.ts(1374,4):  error TS1128: Declaration or statement expected.
routes-broken.ts(1859,1):  error TS1128: Declaration or statement expected.
```

The logic inside that fragment already exists intact in the working `server/routes.ts`, so it is
redundant as well as broken. **Deleting the fragment should restore all 67 endpoints.**

Note that `server/routes.ts.backup` contains the identical break at line 1320, so it is not a
usable recovery point.

**This is the highest-leverage fix in the repository: one deletion recovers 56 endpoints and
clears every type error.**

### 4. Live Google API keys are committed to git

The tracked `.env` at `HEAD` contains two real credentials:

```
VITE_GOOGLE_API_KEY=<redacted>
VITE_GOOGLE_MAPS_API_KEY=<redacted>
```

Adding `.env` to `.gitignore` now will not help, because the values are already in history.

**Fix, in order:** rotate both keys at Google first, then `git rm --cached .env`, add it to
`.gitignore`, and purge it from history (`git filter-repo` or BFG). Note the `VITE_` prefix means
these are also inlined into the client bundle at build time, so they must be treated as public
and restricted by HTTP referrer at the Google console regardless.

### 5. Authentication is entirely stubbed out

`client/src/hooks/useAuth.ts` ignores its imported `useQuery` and returns a hardcoded admin:

```ts
return {
  user: demoUser,          // id: "homemart_admin_001", role admin
  isLoading: false,
  isAuthenticated: true,
  checked: true
};
```

`client/src/App.tsx:49` then forces demo mode on unconditionally via a trailing `|| true`:

```ts
const isDemoMode = window.location.hostname.includes('replit.dev') || true;
```

On the server, `routes.ts` imports the guard but never applies it. The only occurrence of
`isAuthenticated` in the entire file is the import on line 4:

```
4: import { setupAuth, isAuthenticated } from "./replitAuth";
```

**Net effect: all 11 live endpoints are publicly accessible with no authentication, and
`Login.tsx` / `Register.tsx` are unreachable.**

---

## P1 — Install and build

### 6. `npm install` fails on a clean clone

```
vite:              ^7.3.1
@tailwindcss/vite: ^4.1.3   (requires vite ^5 || ^6)
```

The install only succeeds with `--legacy-peer-deps`, which means a fresh clone or a CI runner
cannot install the project.

### 7. Two competing Tailwind setups

`tailwindcss@^3.4.17` is what actually renders, via `tailwind.config.ts`, `postcss.config.js`,
and `@tailwind base` directives. Yet `@tailwindcss/vite@^4.1.3` (the v4 plugin) is also
installed. Removing the v4 plugin resolves both this and finding 6.

### 8. `npm run check` fails

All seven errors trace back to the dead `routes-broken.ts` described in finding 3.

---

## P2 — Hygiene

- **`.git` is 239 MB.** Around 130 MB of `attached_assets/` (149 tracked files) plus `.local/`
  Replit agent state are committed. Clones are slow. These belong in `.gitignore` or Git LFS.
- **Three dead i18n copies**, 1,710 unused lines total: `i18n_backup.ts` (817),
  `i18n_fixed.ts` (376), `translations.ts` (517). Only `i18n.ts` is imported.
- **Dead files:** `server/routes-broken.ts`, `server/routes.ts.backup`, and the orphaned pages
  `MobileFieldApp.tsx` and `RouteOptimization.tsx` (never routed in `App.tsx`).
- **`not-found.tsx` is never routed.** There is no fallback `<Route>` in the authenticated
  switch, so an unknown URL renders a blank screen instead of the 404 page.
- **The error handler crashes the process.** `server/index.ts:42-48` responds and then rethrows
  inside an Express error middleware:

  ```ts
  res.status(status).json({ message });
  throw err;                              // takes down the process on any handled error
  ```

  The `throw err` should be removed, or replaced with logging.
- **Hardcoded business figures** in `/api/dashboard/summary`, e.g. `revenue: 57800000`. There is
  also a duplicate `message2` key in the restore response.
- **`Math.random()` standing in for real data** in `AuditTrail`, `RouteManagement`,
  `RouteOptimization`, and `BulkImport`.

---

## Recommended order of work

1. Rotate both Google API keys; untrack `.env` and purge it from history.
2. Delete the orphaned fragment at `routes-broken.ts:1279-1374`, then rename the file to
   `routes.ts` — recovers 56 endpoints and clears all 7 type errors.
3. Make `replitAuth` lazy or optional so the server boots on any host.
4. Drop `@tailwindcss/vite` (or pin `vite` to `^6`) so `npm install` works without flags.
5. Replace the stubbed auth with real sessions, and apply `isAuthenticated` to every route that
   needs it.
6. Purge `attached_assets/` and `.local/` from history; delete the dead files listed above.

Steps 1 and 2 are independent of everything else and can be done immediately.
