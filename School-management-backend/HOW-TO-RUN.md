# How to Run the Backend

## Prerequisites
✅ PostgreSQL is already running in Docker
✅ All dependencies are installed

## Quick Start

### 1. Start the Backend Server
```bash
cd School-management-backend
npm run dev
```

The server will start on **http://localhost:5000**

### 2. Access Swagger Documentation
Open in your browser:
**http://localhost:5000/api-docs**

### 3. Test the API
Use Swagger UI or any API client:

**Login:**
- Email: `admin@demo.com`
- Password: `admin123`

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Endpoints

- **Health Check:** http://localhost:5000/health
- **API Docs:** http://localhost:5000/api-docs
- **API Base:** http://localhost:5000/api

## Services Running

✅ **Backend API:** http://localhost:5000  
✅ **Frontend:** http://localhost:3000  
✅ **PostgreSQL:** localhost:5432 (Docker)  
✅ **Swagger Docs:** http://localhost:5000/api-docs

## Troubleshooting

**If backend won't start:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**If database connection fails:**
```bash
# Check if PostgreSQL is running
docker ps

# If not running, start it
docker start school-postgres
```

**If Prisma errors:**
```bash
npm run prisma:generate
```

## Next Steps

1. ✅ Backend is running
2. ✅ Swagger docs available
3. 🔄 Connect frontend to backend
4. 🔄 Test end-to-end workflows
