#!/bin/bash

echo "🔄 Database Migration: Local to Supabase"
echo "========================================"

# Configuration
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="5433"
LOCAL_DB_NAME="stmg"
LOCAL_DB_USER="postgres"
SUPABASE_URL="postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres"

echo "📋 Configuration:"
echo "Local DB: $LOCAL_DB_HOST:$LOCAL_DB_PORT/$LOCAL_DB_NAME"
echo "Supabase: db.xfqahkbvjbskepciciil.supabase.co"
echo ""

# Check if local database is running
echo "🔍 Checking local database connection..."
if ! pg_isready -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER > /dev/null 2>&1; then
    echo "❌ Local database is not running!"
    echo "💡 Start your local database first:"
    echo "   cd server && npm start"
    echo "   OR"
    echo "   docker-compose up -d"
    exit 1
fi

echo "✅ Local database is running"

# Export local database
echo ""
echo "📤 Exporting local database..."
EXPORT_FILE="local_database_export_$(date +%Y%m%d_%H%M%S).sql"

pg_dump -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -d $LOCAL_DB_NAME > $EXPORT_FILE

if [ $? -eq 0 ]; then
    echo "✅ Database exported to: $EXPORT_FILE"
    echo "📊 Export size: $(du -h $EXPORT_FILE | cut -f1)"
else
    echo "❌ Export failed!"
    exit 1
fi

# Show export summary
echo ""
echo "📋 Export Summary:"
echo "=================="
echo "Tables found:"
grep -c "CREATE TABLE" $EXPORT_FILE 2>/dev/null || echo "0"
echo "Data inserts:"
grep -c "INSERT INTO" $EXPORT_FILE 2>/dev/null || echo "0"

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Import to Supabase using one of these methods:"
echo ""
echo "   Method A - Supabase Dashboard:"
echo "   • Go to: https://supabase.com/dashboard/project/xfqahkbvjbskepciciil"
echo "   • Navigate to SQL Editor"
echo "   • Create new query"
echo "   • Copy and paste the contents of: $EXPORT_FILE"
echo "   • Run the query"
echo ""
echo "   Method B - Command Line:"
echo "   psql \"$SUPABASE_URL\" -f $EXPORT_FILE"
echo ""
echo "   Method C - Automated (run this script with --import flag):"
echo "   ./migrate-db.sh --import"
echo ""

# Check if --import flag is provided
if [ "$1" = "--import" ]; then
    echo "📥 Importing to Supabase..."
    
    # Test Supabase connection first
    echo "🔍 Testing Supabase connection..."
    if ! psql "$SUPABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "❌ Cannot connect to Supabase!"
        echo "💡 Check your connection string and network"
        exit 1
    fi
    
    echo "✅ Supabase connection successful"
    
    # Import the database
    echo "📥 Importing database..."
    psql "$SUPABASE_URL" -f $EXPORT_FILE
    
    if [ $? -eq 0 ]; then
        echo "✅ Database imported successfully!"
        echo ""
        echo "🧪 Testing import..."
        psql "$SUPABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
        echo ""
        echo "🎉 Migration complete!"
        echo "🚀 Your Supabase database is ready for deployment"
    else
        echo "❌ Import failed!"
        echo "💡 Try importing manually using the Supabase dashboard"
    fi
fi

echo ""
echo "📁 Export file saved as: $EXPORT_FILE"
echo "🗑️  You can delete this file after successful import"
