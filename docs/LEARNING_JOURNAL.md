# Learning Journal

## 2025-11-16

**What I tackled**
- Made `/api/settings/public` truly public by combining the `@Public()` decorator with a smarter `AdminGuard` that skips authorization checks on open endpoints.
- Fixed the admin login loop on the frontend by unpacking the backend’s `{ success, data, message }` response wrapper in `AuthContext` and the shared Axios instance.
- Normalized all Axios responses so UI components keep receiving plain objects/arrays (`response.data` now points directly to the payload, with the original wrapper stored on `response.meta` when needed).

**Key commands**
```bash
# Restart NestJS to pick up new decorators
cd nestjs-backend && npm run start:dev

# Test login flow directly against the API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'
```

**Lessons learned**
- When stacking multiple guards, every guard must respect custom metadata such as `@Public()`—otherwise the last guard still blocks the route.
- Global response interceptors improve consistency, but the frontend must unwrap the payload; a centralized Axios interceptor prevents repetitive fix-ups across components.
- Verifying the API response shape with `curl` or HTTP files before debugging the UI saves time and confirms whether the issue is backend or frontend.

**Debugging approach**
1. Check browser console → saw `401 Unauthorized` on `/api/settings/public`
2. Test endpoint with `curl` → confirmed backend returned 403 from `AdminGuard`
3. Traced guard logic → found `AdminGuard` didn't check `@Public()` metadata
4. Added `Reflector` to `AdminGuard` → endpoint now returns 200
5. Admin login still failed → checked Network tab → response nested under `data.data`
6. Updated `AuthContext` to extract `response.data.data.token` → login worked
7. Categories page crashed with `.filter is not a function` → added global Axios interceptor to unwrap all responses

**Next actions**
- Wire `RabbitMQService` into `OrdersService` so order creation emits `order.created` events for async notification/analytics.
- Seed baseline categories and products to avoid empty admin dashboards after a clean setup.
- Run the full frontend flow (login → manage products/categories) to confirm the response normalization resolved all `*.filter` runtime errors.

---

## 2025-11-14

**What I tackled**
- Rebuilt `docker-compose.yml` to run PostgreSQL, Redis, and RabbitMQ locally while keeping the NestJS API on the host for hot reload. Added health checks, persisted volumes, and clarified port mappings (Postgres on 5434 to avoid macOS conflicts).
- Created `Dockerfile.dev` plus the `start-api.sh` helper so onboarding is a single command (`./start-api.sh` handles containers, dependency install, and `npm run start:dev`).
- Solved the `sh: nest: not found` crash by realizing volume mounts were nuking container `node_modules`; the fix was to install dependencies on the host and bind only source files.
- Updated `.env`, documentation (`LOCAL_PREVIEW_FIXED.md`, `SETUP_GUIDE.md`, `SETUP_COMMANDS.md`), and `APP_CONFIG` defaults so the frontend points to `http://localhost:3000/api`.

**Key commands**
```bash
# Bring up data services with health checks
docker compose up -d

# Automated local start (services + API)
./start-api.sh
```

**Lessons learned**
- Always map Postgres to a non-default host port on macOS; the system launch daemon often reserves 5432/5433.
- Volume-mounting `node_modules` from the host into a container wipes out everything installed during `docker build`; keep dev installs on the host or use named volumes.
- Development docs must explain the “API in host / infra in Docker” split, otherwise teammates assume `docker compose up` also launches the NestJS server.

**Next actions**
- Add a seed script that populates categories/products so the UI isn’t empty after `docker compose down -v`.
- Layer RabbitMQ events into orders/products now that the broker is healthy by default.
- Automate `.env` creation (template + script) to eliminate manual copy/paste.

---

## 2025-11-12

**What I tackled**
- **Express → NestJS migration**: Converted Sequelize models to TypeORM entities (User, Product, Category, Order, OrderItem, Cart, Wishlist, Setting, ImgBBImage, News). Mapped Express routes to NestJS controllers with proper DTOs for validation.
- **Architecture improvements**: Split monolithic Express server into NestJS modules (AuthModule, ProductsModule, CategoriesModule, OrdersModule, CartModule, WishlistModule, DashboardModule, SettingsModule, ImagesModule, NewsModule). Each module encapsulates its own controller, service, and repository.
- **Security & middleware**: Implemented JWT authentication with Passport strategy, role-based guards (JwtAuthGuard, AdminGuard), and global interceptors (LoggingInterceptor for request/response logging, TransformInterceptor for consistent API responses, CacheInterceptor for Redis integration).
- **Redis integration**: Added `RedisModule` with graceful degradation (falls back to memory cache if Redis unavailable). Implemented cache-aside pattern in `ProductsService` with automatic invalidation on updates.
- **Testing infrastructure**: Created unit tests (`products.service.spec.ts`, `auth.service.spec.ts`) with mocked dependencies, integration tests (`products.integration.spec.ts`) with real Redis, and E2E tests (`app.e2e-spec.ts`) with Supertest.
- **CI/CD setup**: GitHub Actions workflows for automated linting, testing, building, and Docker image creation. Added deployment workflow for DigitalOcean with SSH-based deployment. Documented in `docs/CI_CD_EXPLAINED.md` and `docs/COMMIT_GUIDE.md`.
- **Code quality**: Configured ESLint + Prettier for TypeScript, added conventional commit guidelines, and cleaned up 42+ outdated documentation files into an `archived/` folder.

**Key commands**
```bash
# Run the full NestJS test suite (unit + integration + e2e)
cd nestjs-backend && npm run test:all

# Generate and run database migrations when needed
cd nestjs-backend && npm run migration:generate -- src/migrations/<name>
cd nestjs-backend && npm run migration:run
```

**Debugging approach during migration**
1. Started by analyzing Express `server/config/dbSequelize.js` to understand existing Sequelize models
2. Created TypeORM entities matching Sequelize schema (column types, relations, indexes)
3. Ported Express routes one-by-one to NestJS controllers, testing each with `curl` before moving on
4. Hit ESLint errors for unused variables in destructuring → fixed with `_password` naming convention
5. TypeScript complained about `any` types in decorators → added `// eslint-disable-next-line` comments
6. Missing `@nestjs/mapped-types` package broke build → installed it for `PartialType` in DTOs
7. RabbitMQ type mismatch → explicitly typed `useFactory` return as `RmqOptions`
8. Dashboard service errors → corrected `p.stock` to `p.quantity`, `order.totalAmount` to `order.total`
9. Integration tests failed with missing `DataSource` → added mock provider to test module

**Lessons learned**
- NestJS's global `TransformInterceptor` makes the API responses feel premium, but every client (tests, frontend, HTTP files) must expect the `{ success, data, message }` envelope.
- Keeping modules small (ProductsModule, CategoriesModule, etc.) plus `TypeOrmModule.forFeature` exports makes dependency injection predictable and the dashboard service trivial to compose.
- Integration tests that talk to real Redis caught issues the unit tests missed (`redisService.getOrSet` mocks hid contract changes), so running both is worth the extra time.
- When migrating from Sequelize to TypeORM, column names might differ (e.g., `stock` vs `quantity`) — always check the entity definitions before writing queries.

**Next actions**
- Hook RabbitMQ into order/product flows so the architecture demonstrates async processing.
- Harden the admin flow: seed a default admin, ensure pending approvals are respected end-to-end, and add UI messaging when role/approval blocks access.
- Finish polishing documentation so the README + PROJECT_SUMMARY explain deployment, stack choices, and monitoring at a glance.

