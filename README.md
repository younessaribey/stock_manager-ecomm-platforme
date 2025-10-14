# Stock Manager E-commerce Platform

A full-stack e-commerce platform for stock management with React frontend and Node.js/Express backend.

## Project Structure

```
stock_manager-ecomm-platforme/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── server.js       # Main server file
│   └── package.json
├── public/                 # Static files
│   ├── manifest.json
│   └── index.html
├── src/                    # React frontend
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock_manager-ecomm-platforme
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Run Both Frontend and Backend

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm start
```
The frontend will run on http://localhost:3000

#### Option 2: Run Backend Only
```bash
cd backend
npm start
```

#### Option 3: Run Frontend Only
```bash
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock_manager
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

## Features

- ✅ Product management (CRUD operations)
- ✅ Category management
- ✅ Order management
- ✅ User management
- ✅ RESTful API design
- ✅ Error handling
- ✅ CORS enabled
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)

## Troubleshooting

### Manifest.json 404 Error
The original error you encountered was due to missing project files. This has been resolved by:
1. Creating proper `public/manifest.json`
2. Setting up correct `public/index.html` with proper `%PUBLIC_URL%` references
3. Installing all required dependencies

### react-scripts: command not found
This error occurs when dependencies aren't installed. Run:
```bash
npm install
```

## Next Steps

1. Set up a database (MongoDB recommended)
2. Add authentication and authorization
3. Implement real-time stock updates
4. Add file upload for product images
5. Implement payment processing
6. Add comprehensive testing
7. Deploy to production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License# Deployment ready - Wed Oct 15 02:47:09 +08 2025
