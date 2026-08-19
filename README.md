# Mini ERP — MERN

A production-oriented MERN implementation of the "Mini ERP: From Demand to Delivery" specification.

## Current milestone

Phase 1 is intentionally limited to a tested foundation:

- Express API with centralized error handling
- MongoDB/Mongoose
- JWT authentication in an HTTP-only cookie
- Role-based access control
- Admin seed account
- Product creation/listing
- Basic product stock fields
- React/Vite frontend
- Login page
- Protected dashboard
- Product management page
- API integration with credentials
- Backend unit/integration tests

The full target architecture is documented below. Modules are added and tested one at a time rather than pretending an untested monolith is production-ready.

## Target modules

1. Authentication & RBAC
2. Products
3. Bill of Materials (BoM)
4. Sales
5. Purchase
6. Manufacturing
7. Inventory / Stock Ledger
8. Procurement automation
9. Audit logs
10. Dashboard

## Business flow

Sales -> inventory availability -> reservation -> procurement (MTO when needed) -> purchase/manufacturing -> stock movements -> delivery.

For manufacturing:

Product -> BoM -> Manufacturing Order -> Work Orders -> component consumption + finished-goods receipt -> Stock Ledger.

## Requirements

- Node.js 20+
- MongoDB 7+ (local or Atlas)
- npm

## Setup

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

API: http://localhost:5000

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173

Default seeded admin:

- email: admin@shiverp.local
- password: ChangeMe123!

Change the password immediately for any real deployment.

## Test

Backend:

```bash
cd server
npm test
```

Client:

```bash
cd client
npm test
```

## Important production note

This repository is being built incrementally. A feature is considered complete only after its API, business rules, persistence, UI, authorization, validation, and tests are implemented and exercised.
