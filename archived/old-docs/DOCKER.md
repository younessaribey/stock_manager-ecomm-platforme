# Docker Deployment Guide for Stock Management Application

This guide provides instructions for deploying the full stack Stock Management Application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git for cloning the repository

## Structure

The application consists of three main components:

1. **Client**: React frontend application
2. **Server**: Express.js backend API
3. **Database**: PostgreSQL database

## Deployment Steps

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd stmg
```

### 2. Environment Variables

Make sure your `.env` file in the root directory contains the necessary environment variables:

```
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=stockapp
```

### 3. Build and Start the Containers

```bash
docker-compose up -d
```

This command will:
- Build the client and server Docker images
- Start all services defined in the docker-compose.yml file
- Create a Docker network for communication between containers
- Set up a persistent volume for PostgreSQL data

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 5. Stopping the Application

```bash
docker-compose down
```

To also remove the persistent volumes:

```bash
docker-compose down -v
```

## Production Deployment

For production deployment, consider:

1. Setting up a reverse proxy like Nginx to handle SSL termination
2. Updating the REACT_APP_API_URL in docker-compose.yml to point to your domain
3. Using Docker secrets or a secure environment variable manager for sensitive information

### Deploying to a Cloud Provider

This setup can be deployed to any cloud provider that supports Docker, such as:

- AWS ECS/EKS
- Google Cloud Run/GKE
- Azure Container Instances/AKS
- Digital Ocean App Platform

## Mock Data Functionality

The frontend is configured to use mock data by default, allowing it to function even if the backend is temporarily unavailable. This behavior can be toggled in the `client/src/pages/public/Products.js` file by switching between `loadMockData()` and `loadRealData()` functions.
