# Quick Setup Guide - Phase 1 MVP Backend

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

## Step 1: Database Setup

### Option A: Use Local PostgreSQL
1. Install PostgreSQL if not already installed
2. Create database:
```sql
CREATE DATABASE school_management;
```

### Option B: Use Docker (Easiest)
```bash
docker run --name school-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=school_management -p 5432:5432 -d postgres
```

## Step 2: Configure Environment

Update `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/school_management"
JWT_SECRET="your-super-secret-key-change-this"
PORT=5000
```

## Step 3: Install & Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

## Step 4: Create First User

You'll need to manually create the first admin user in the database.

### Option A: Using Prisma Studio
```bash
npm run prisma:studio
```
Then create a School and User record.

### Option B: Using SQL
```sql
-- Create a school
INSERT INTO "School" (id, name, email, phone, address, "createdAt", "updatedAt")
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo School', 'school@demo.com', '1234567890', '123 Main St', NOW(), NOW());

-- Create admin user (password: admin123)
INSERT INTO "User" (id, email, password, role, "firstName", "lastName", "schoolId", "createdAt", "updatedAt")
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'admin@demo.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYhQWy',
  'SCHOOL_ADMIN',
  'Admin',
  'User',
  '550e8400-e29b-41d4-a716-446655440000',
  NOW(),
  NOW()
);
```

## Step 5: Test API

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'
```

## Next Steps

1. Test all endpoints using Postman or Thunder Client
2. Connect frontend to backend
3. Start adding real data
4. Deploy to production

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
PORT=5001
```

**Database connection error:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check firewall settings

**Prisma errors:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate client
npm run prisma:generate
```
