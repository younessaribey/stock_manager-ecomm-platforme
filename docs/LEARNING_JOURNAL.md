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

**Next actions**
- Wire `RabbitMQService` into `OrdersService` so order creation emits `order.created` events for async notification/analytics.
- Seed baseline categories and products to avoid empty admin dashboards after a clean setup.
- Run the full frontend flow (login → manage products/categories) to confirm the response normalization resolved all `*.filter` runtime errors.

