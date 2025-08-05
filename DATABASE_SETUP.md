# HashPrize Multi-Environment Database Setup

This guide explains how to use SQLite for local development and Azure SQL Database for production deployment.

## Overview

- **Development**: Uses SQLite with `dev.db` file
- **Production**: Uses Azure SQL Database
- **Prisma Schema**: Separate schemas for each environment
- **Environment Variables**: Different `.env` files for each environment

## Development Setup (SQLite)

### 1. Use the current setup (no changes needed):
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run development migration (if needed)
npm run db:migrate:dev

# Start development server
npm run dev

# Test drawing script
npm run drawing:test
```

## Production Setup (Azure SQL Database)

### 1. Deploy Azure SQL Database
```bash
# Deploy using Azure CLI
az deployment group create \
  --resource-group DefaultResourceGroup-WUS \
  --template-file infrastructure/azure-sql.bicep \
  --parameters administratorLogin=youradmin administratorLoginPassword=YourPassword123!
```

### 2. Update Production Environment
Update `.env.production` with your Azure SQL connection string:
```env
NODE_ENV=production
DATABASE_URL="sqlserver://your-server.database.windows.net:1433;database=hashprize;user=youradmin;password=YourPassword123!;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
```

### 3. Deploy to Production
```bash
# Generate Prisma client for SQL Server
npm run db:generate:prod

# Run production migrations
npm run db:migrate:prod

# Build and deploy your app
npm run build
```

## Database Operations

### Development (SQLite)
```bash
npm run db:generate          # Generate client
npm run db:migrate:dev        # Create/apply migrations
npm run db:studio            # Open Prisma Studio
npm run drawing:test         # Test prize drawing
```

### Production (Azure SQL)
```bash
npm run db:generate:prod     # Generate client for SQL Server
npm run db:migrate:prod      # Deploy migrations to Azure
npm run db:studio:prod       # Open Prisma Studio for Azure
```

## File Structure

```
prisma/
├── schema.prisma            # SQLite schema (development)
├── schema.sqlserver.prisma  # SQL Server schema (production)
├── migrations/              # SQLite migrations
└── dev.db                   # SQLite database file

src/
├── lib/
│   └── db.ts               # Database client utility
└── services/
    └── databaseActions.ts   # Database operations

.env                        # Development environment
.env.production            # Production environment (not in git)

infrastructure/
└── azure-sql.bicep        # Azure deployment template
```

## Key Features

1. **Environment Separation**: Automatic environment detection
2. **Type Safety**: Full Prisma type safety in both environments
3. **Decimal Precision**: Proper handling of HBAR amounts
4. **Migration Management**: Separate migration paths
5. **Connection Pooling**: Optimized database connections

## Database Schema

Both environments use the same data structure:

- **Account**: Hedera account information and staking details
- **Drawing**: Prize drawing results with PRNG transaction IDs

## Security Notes

1. **Connection Strings**: Never commit production connection strings
2. **Firewall Rules**: Configure Azure SQL firewall appropriately
3. **Environment Variables**: Use Azure App Service configuration for production
4. **SSL/TLS**: Always use encrypted connections

## Troubleshooting

### Common Issues

1. **Migration Conflicts**: Use `--reset` flag if needed
2. **Connection Errors**: Check firewall rules in Azure
3. **Type Errors**: Regenerate Prisma client after schema changes
4. **Environment Variables**: Ensure correct `.env` file is loaded

### Commands for Reset

```bash
# Reset development database
npx prisma migrate reset

# Reset production database (careful!)
npx prisma migrate reset --schema=./prisma/schema.sqlserver.prisma
```
