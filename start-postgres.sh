#!/bin/bash

echo "🚀 Starting STMG with PostgreSQL..."

# Ensure PostgreSQL is in PATH
export PATH="/usr/local/Cellar/postgresql@15/15.14/bin:$PATH"

# Start with PostgreSQL configuration
CNX_STRING="" DB_HOST=localhost DB_PORT=5433 DB_USER=mac DB_PASSWORD="" DB_NAME=stmg npm run dev
