# Project Setup Requirements

## Current Status
✅ **Frontend**: Running on http://localhost:3000  
❌ **Backend**: Failed - Database connection error  
❌ **Database**: Not connected

---

## What You Need

### 1. Environment Variables File (.env)

Create a file named `.env` in the `backend/` folder with the following content:

```env
PORT=5000
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cart_store
DB_PORT=3306
SESSION_SECRET=your-secret-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Note**: Replace `your_mysql_password` with your actual MySQL root password.

---

### 2. Database Setup

You have **two options**:

#### Option A: MySQL (Current Default)

1. **Install MySQL** (if not already installed):
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Start MySQL Server**:
   - Windows Service: Start MySQL from Services
   - Or from command line: `net start MySQL` (if installed as service)

3. **Create Database and Tables**:
   ```powershell
   # In PowerShell, navigate to project root
   Get-Content database/mysql/schema.sql | mysql -u root -p
   ```
   
   Or manually in MySQL:
   ```sql
   -- Open MySQL command line or workbench
   -- Run the contents of database/mysql/schema.sql
   ```

4. **Update .env** with your MySQL password:
   ```env
   DB_PASSWORD=your_actual_mysql_password
   ```

#### Option B: MongoDB (Alternative)

1. **Install MongoDB** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud version)

2. **Start MongoDB Server**:
   - Windows Service: Start MongoDB from Services
   - Or from command line: `mongod` (if in PATH)

3. **Update .env** to use MongoDB:
   ```env
   DB_TYPE=mongodb
   MONGODB_URI=mongodb://localhost:27017/cart_store
   ```

   **Note**: MongoDB will create the database and collections automatically on first use.

---

### 3. Dependencies Check

✅ Dependencies appear to be installed (node_modules exist)

If you need to reinstall:
```powershell
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## How to Run the Project

### Step 1: Create .env File
Create `backend/.env` with the configuration above.

### Step 2: Setup Database
Choose MySQL or MongoDB and set it up as described above.

### Step 3: Start Backend
```powershell
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

### Step 4: Start Frontend (in a new terminal)
```powershell
cd frontend
npm run dev
```

---

## Verification

Once both servers are running:

1. **Backend Health Check**: http://localhost:5000/api/health
   - Should return: `{"success": true, "message": "Server is running"}`

2. **Frontend**: http://localhost:3000
   - Should show the product listing page

3. **Admin Panel**: http://localhost:3000/admin/login
   - Default credentials: `admin` / `admin123`

---

## Common Issues

### "ECONNREFUSED" Error
- **Cause**: Database server is not running
- **Fix**: Start MySQL or MongoDB service

### "Access Denied" for MySQL
- **Cause**: Wrong password in .env
- **Fix**: Update `DB_PASSWORD` in `.env` with correct password

### Database doesn't exist
- **Cause**: Schema not created
- **Fix**: Run the SQL schema file or let MongoDB create it automatically

### Port Already in Use
- **Cause**: Another process is using port 5000 or 3000
- **Fix**: 
  ```powershell
  # Find process on port 5000
  netstat -ano | findstr :5000
  # Kill process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

---

## Quick Start Checklist

- [ ] Create `backend/.env` file
- [ ] Install and start MySQL OR MongoDB
- [ ] Create database (MySQL) or ensure MongoDB is running
- [ ] Run `npm start` in backend folder
- [ ] Run `npm run dev` in frontend folder
- [ ] Verify both servers are running
- [ ] Test at http://localhost:3000

