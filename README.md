# Local Cart Store - Inventory & Online Order System

A full-stack web application for a local store in Nagapattinam to display products, manage inventory, and enable customers to place orders online.

## Features

### Frontend
- **Product Display**: User-friendly product listing with search and category filtering
- **Shopping Cart**: Client-side cart with localStorage persistence
- **Order Placement**: Checkout form with customer information capture
- **Admin Panel**: Secure CRUD interface for product management
- **Responsive Design**: Mobile-first approach with modern UI

### Backend
- **RESTful API**: Node.js/Express server with structured endpoints
- **Dual Database Support**: Switch between MySQL and MongoDB via configuration
- **Image Upload**: Secure file uploads with Multer
- **Authentication**: Session-based admin authentication
- **Input Validation**: Comprehensive validation and error handling
- **API Integration Ready**: Utilities for future supplier API integration

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL or MongoDB (configurable)
- **File Upload**: Multer
- **Security**: Helmet, express-session, express-validator

## Project Structure

```
WEB-ACT2/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Data access layer (MySQL & MongoDB)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, upload
│   ├── utils/           # API integration utilities
│   └── uploads/         # Product images storage
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Cart context
│   │   └── services/    # API service layer
└── database/            # Database schemas
    ├── mysql/           # MySQL schema
    └── mongodb/         # MongoDB schemas




WEB-ACT2/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── SearchFilter.jsx
│   │   │   ├── ShoppingCart.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CheckoutForm.jsx
│   │   │   └── Admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ProductForm.jsx
│   │   │       └── ProductTable.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── config/
│   │   ├── database.js (DB connection abstraction)
│   │   └── dbConfig.js (switch between MySQL/MongoDB)
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── models/
│   │   ├── mysql/
│   │   │   ├── productModel.js
│   │   │   ├── orderModel.js
│   │   │   └── customerModel.js
│   │   ├── mongodb/
│   │   │   ├── productModel.js
│   │   │   ├── orderModel.js
│   │   │   └── customerModel.js
│   │   └── dal.js (Data Access Layer interface)
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js (Multer config)
│   │   └── validation.js
│   ├── utils/
│   │   └── apiIntegration.js (future supplier API readiness)
│   ├── uploads/ (product images)
│   ├── server.js
│   └── package.json
├── database/
│   ├── mysql/
│   │   └── schema.sql (SQL schema for Products, Customers, Orders, Order_Items)
│   └── mongodb/
│       └── seed.js (optional seed data)
└── README.md
```
## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (if using MySQL) OR MongoDB (if using MongoDB)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Edit `.env` with your database credentials
   ```env
   PORT=5000
   DB_TYPE=mysql  # or 'mongodb'
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=cart_store
   SESSION_SECRET=your-secret-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Setup Database:**

   **For MySQL:**
   
   **On Linux/Mac (Bash):**
   ```bash
   mysql -u root -p < ../database/mysql/schema.sql
   ```
   
   **On Windows (PowerShell):**
   ```powershell
   # Option 1: Use Get-Content to pipe the file
   Get-Content ../database/mysql/schema.sql | mysql -u root -p
   
   # Option 2: Use cmd.exe for bash-style redirection
   cmd /c "mysql -u root -p < ../database/mysql/schema.sql"
   ```

   **For MongoDB:**
   - MongoDB will create database and collections automatically on first use
   - Or run seed script if provided

5. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## Database Switching

The application supports both MySQL and MongoDB. To switch between them:

1. **Edit `backend/.env`:**
   ```env
   DB_TYPE=mysql    # Use MySQL
   # or
   DB_TYPE=mongodb  # Use MongoDB
   ```

2. **Comment/Uncomment database-specific code:**
   - The DAL (Data Access Layer) in `backend/models/dal.js` automatically routes to the correct implementation
   - If you're not using a database, you can comment out its connection code in `backend/config/database.js`

3. **Ensure proper database setup:**
   - For MySQL: Run the SQL schema script
   - For MongoDB: Ensure MongoDB is running (collections created automatically)

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional ?category=Food&search=rice)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/status` - Check authentication status

## Usage

### As Customer
1. Browse products on the home page
2. Use search and category filters to find products
3. Add products to cart
4. View cart and proceed to checkout
5. Fill in customer information and place order

### As Admin
1. Navigate to `/admin/login`
2. Login with credentials (default: admin/admin123)
3. View, add, edit, or delete products
4. Upload product images
5. Manage inventory stock

## Future API Integration

The system is designed for easy integration with supplier APIs:

1. **Utility functions** are available in `backend/utils/apiIntegration.js`
2. **Functions include:**
   - `fetchSupplierStock()` - Fetch stock from supplier API
   - `mergeSupplierStock()` - Merge supplier data with local products
   - `updateLocalStockFromSupplier()` - Sync stock levels

3. **Example integration workflow:**
   ```javascript
   // Fetch from supplier
   const supplierData = await fetchSupplierStock('https://supplier-api.com/stock');
   
   // Merge with local
   const merged = mergeSupplierStock(localProducts, supplierData.data, matchFunction)
   // Update database
   await updateLocalStockFromSupplier(merged, updateProduct);
   ```

## Security Features

- Session-based authentication for admin
- Input validation on all endpoints
- SQL injection protection (parameterized queries)
- Secure file upload validation (type and size limits)
- Helmet.js for security headers
- CORS configuration

## Development Notes

- **Database Models**: Separate implementations for MySQL and MongoDB in `backend/models/mysql/` and `backend/models/mongodb/`
- **DAL Pattern**: `backend/models/dal.js` abstracts database operations, allowing easy switching
- **Image Storage**: Product images stored in `backend/uploads/` directory
- **Cart Persistence**: Shopping cart saved in browser localStorage

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `.env`
- Ensure database server is running
- Check database name exists (MySQL) or MongoDB connection string

### Image Upload Issues
- Ensure `backend/uploads/` directory exists and is writable
- Check file size limits (default: 5MB)
- Verify file type (only images allowed)

### CORS Issues
- Ensure frontend URL matches `FRONTEND_URL` in backend `.env`
- Check proxy configuration in `frontend/vite.config.js`

## License

ISC

## Author

Local Cart Store Development Team

---

**Note**: This is a development version. For production deployment:
- Change default admin credentials
- Use strong session secrets
- Configure proper CORS origins
- Set up HTTPS
- Use production database credentials
- Implement proper error logging

