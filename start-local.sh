#!/bin/bash

# Start the server with SQLite for local development
echo "Starting STMG server with SQLite for local development..."

# Set environment variables for SQLite
export DB_TYPE=sqlite
export JWT_SECRET=test-secret-key-123
export DB_PATH=./server/database.sqlite

# Start both server and client
npm start
