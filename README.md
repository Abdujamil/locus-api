# 🧬 Locus API

A RESTful API built with **NestJS + TypeScript** for querying genomic locus data from the [RNACentral](https://rnacentral.org/help/public-database) public database.

Includes JWT authentication with role-based access control, Swagger documentation, pagination, filtering, sorting, and sideloading.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL (RNACentral public DB) |
| ORM | TypeORM |
| Auth | JWT + Passport |
| Docs | Swagger / OpenAPI |
| Security | Helmet, Throttler (rate limiting) |
| Tests | Jest (unit + e2e) |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/locus-api.git
cd locus-api
npm install
```

### Run in development

```bash
npm run start:dev
```

App will be available at: `http://localhost:3000`

Swagger docs: `http://localhost:3000/api/docs`

---

## 🔐 Authentication

The API uses **JWT Bearer Token** authentication.

Three pre-defined users are available:

| Username | Password | Role |
|---|---|---|
| `admin` | `password` | Full access to all columns + sideloading |
| `normal` | `password` | Access only to `rl` table data, no sideloading |
| `limited` | `password` | Access only for specific regionIds |

### Get a token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use the token in subsequent requests:
```bash
curl http://localhost:3000/api/locus \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📡 API Reference

### `GET /api/locus`

Returns a paginated list of genomic loci with optional filtering, sorting, and sideloading.

#### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `number[]` | Comma-separated list of locus IDs (e.g. `1,2,3`) |
| `assemblyId` | `string` | Single assembly ID value |
| `regionId` | `number[]` | Comma-separated list of region IDs |
| `membershipStatus` | `string` | Filter by membership status (e.g. `member`) |
| `sideloading` | `locusMembers` | Include related locus members in response |
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Rows per page (default: `1000`) |
| `sortBy` | `string` | Field to sort by (e.g. `id`, `locusStart`, `memberCount`) |
| `sortOrder` | `ASC \| DESC` | Sort direction (default: `ASC`) |

#### Example — basic request

```bash
curl "http://localhost:3000/api/locus?limit=2&sortBy=id" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```json
[
  {
    "id": 3106326,
    "assemblyId": "WEWSeq_v.1.0",
    "locusName": "cfc38349...@4A/547925668-547987324:1",
    "publicLocusName": "432B32430F9FCBB8",
    "chromosome": "4A",
    "strand": "1",
    "locusStart": 547925668,
    "locusStop": 547987324,
    "memberCount": 259
  }
]
```

#### Example — with sideloading (admin only)

```bash
curl "http://localhost:3000/api/locus?sideloading=locusMembers&limit=1" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

```json
[
  {
    "id": 3106352,
    "assemblyId": "Rrox_v1",
    "locusName": "12b97d95...@KN300177.1/1081562-1081689:-1",
    "publicLocusName": "30CA93230012AFC9",
    "chromosome": "KN300177.1",
    "strand": "-1",
    "locusStart": 1081562,
    "locusStop": 1081689,
    "memberCount": 1,
    "ursTaxid": "URS0000A888AB_61622",
    "locusMembers": [
      {
        "id": 3106352,
        "regionId": 85682522,
        "locusId": 2470322,
        "membershipStatus": "member"
      }
    ]
  }
]
```

---

## 👥 Role-based Access Control

| Feature | admin | normal | limited |
|---|---|---|---|
| All `rnc_locus` columns | ✅ | ✅ | ✅ |
| `rnc_locus_members` data | ✅ | ❌ | ❌ |
| Sideloading (`locusMembers`) | ✅ | ❌ | ❌ |
| Filter by any `regionId` | ✅ | ✅ | ⚠️ Only `86118093`, `86696489`, `88186467` |

---

## 🗄️ Database

Connects to the **RNACentral public PostgreSQL** database (read-only):

| Field | Value |
|---|---|
| Host | `hh-pgsql-public.ebi.ac.uk` |
| Port | `5432` |
| Database | `pfmegrnargs` |
| User | `reader` |

Main tables used:

- **`rnc_locus`** — core locus data
- **`rnc_locus_members`** — related members, joined via `locus_id`

---

## 🧪 Tests

### Unit tests (no DB required)

```bash
npm run test
```

Covers:
- `AuthService` — login, invalid credentials, role assignment
- `LocusService` — permission guards, filters, pagination, sideloading logic

### E2E tests (requires internet connection to RNACentral DB)

```bash
npm run test:e2e
```

Covers:
- `POST /api/auth/login` — valid/invalid credentials
- `GET /api/locus` — auth guard, role permissions, response shape

---

## 📁 Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.service.spec.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
├── locus/
│   ├── dto/
│   │   └── get-locus.dto.ts
│   ├── entities/
│   │   ├── locus.entity.ts
│   │   └── locus-member.entity.ts
│   ├── locus.controller.ts
│   ├── locus.module.ts
│   ├── locus.service.ts
│   └── locus.service.spec.ts
├── app.module.ts
└── main.ts
test/
└── app.e2e-spec.ts
```

---

## 📖 Swagger Documentation

Interactive API docs are available at:

```
http://localhost:3000/api/docs
```

1. Click **Authorize** button
2. First call `POST /api/auth/login` to get your token
3. Paste the token into the Bearer field
4. Explore and test all endpoints directly in the browser
