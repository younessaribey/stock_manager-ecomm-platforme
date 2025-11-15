# Database Migration Guide: Local to Supabase

## 🎯 Export Local Database to Supabase

### Step 1: Export Your Local Database

#### If you're using PostgreSQL locally:
```bash
# Export database structure and data
pg_dump -h localhost -U postgres -d your_local_db_name > local_database.sql

# Or if you want only structure (schema)
pg_dump -h localhost -U postgres -d your_local_db_name --schema-only > schema.sql

# Or if you want only data
pg_dump -h localhost -U postgres -d your_local_db_name --data-only > data.sql
```

#### If you're using SQLite locally:
```bash
# Export SQLite to SQL format
sqlite3 your_database.db .dump > local_database.sql
```

### Step 2: Import to Supabase

#### Option A: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/xfqahkbvjbskepciciil
2. **Navigate to SQL Editor**
3. **Click "New Query"**
4. **Paste your SQL dump** and run it

#### Option B: Using psql command line

```bash
# Connect to Supabase and import
psql "postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" -f local_database.sql
```

#### Option C: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref xfqahkbvjbskepciciil

# Import your database
supabase db reset --db-url "postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres"
```

---

## 🔧 Alternative: Let Your App Create Tables Automatically

### If you don't have important data to migrate:

Your server code already has database initialization! When you deploy with the environment variables, it will:

1. **Connect to Supabase**
2. **Create all necessary tables** automatically
3. **Set up the database structure**

### Check your server code:
Your `server/config/dbSequelize.js` likely has:
- Table creation
- Database verification
- Automatic setup

---

## 📋 Step-by-Step Migration Process

### Step 1: Check What's in Your Local Database
```bash
# If using PostgreSQL
psql -h localhost -U postgres -d your_db_name -c "\dt"

# If using SQLite
sqlite3 your_database.db ".tables"
```

### Step 2: Export Your Data
```bash
# Full export (structure + data)
pg_dump -h localhost -U postgres -d your_db_name > full_export.sql

# Or just the data you need
pg_dump -h localhost -U postgres -d your_db_name --data-only > data_only.sql
```

### Step 3: Import to Supabase
1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Create new query**
4. **Paste and run your SQL**

### Step 4: Verify Import
```bash
# Test connection
psql "postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" -c "\dt"
```

---

## 🎯 Quick Migration Script

Create this script to automate the process:

```bash
#!/bin/bash
echo "🔄 Migrating local database to Supabase..."

# Export local database
echo "📤 Exporting local database..."
pg_dump -h localhost -U postgres -d your_local_db > migration.sql

# Import to Supabase
echo "📥 Importing to Supabase..."
psql "postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" -f migration.sql

echo "✅ Migration complete!"
echo "🧪 Test your database:"
echo "psql 'postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres' -c 'SELECT COUNT(*) FROM users;'"
```

---

## 🚨 Important Notes

### Data Types Compatibility:
- **PostgreSQL to PostgreSQL**: ✅ Perfect compatibility
- **SQLite to PostgreSQL**: ⚠️ May need adjustments for:
  - Data types (INTEGER vs SERIAL)
  - Date formats
  - Boolean values (0/1 vs true/false)

### Common Issues:
1. **Auto-increment IDs**: May need to reset sequences
2. **Foreign keys**: Ensure they're created in correct order
3. **Data types**: Check for compatibility issues

---

## 🧪 Testing Your Migration

### After importing, test these queries:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check data counts
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM orders;

-- Test a simple query
SELECT * FROM users LIMIT 5;
```

---

## 🎯 Recommended Approach

### For Production Data:
1. **Export your local database**
2. **Import to Supabase using SQL Editor**
3. **Verify data integrity**
4. **Test your application**

### For Development/Testing:
1. **Let your app create tables automatically**
2. **Add sample data through your application**
3. **Use the built-in database initialization**

---

## 📞 Need Help?

If you encounter issues:
1. **Check the SQL syntax** in your export
2. **Verify Supabase connection** is working
3. **Test with a small subset** of data first
4. **Check Supabase logs** for errors

Your Supabase database is ready at:
`postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres`
