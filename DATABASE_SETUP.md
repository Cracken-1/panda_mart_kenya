# Database Setup Guide

## Quick Development Setup (Current Fallback System)

The application currently uses a fallback system that stores user data in localStorage when PostgreSQL is not available. This allows you to test the registration and onboarding features immediately without setting up a database.

### How the Fallback Works:
- Registration attempts to use the API first
- If the database connection fails, it falls back to localStorage
- User data is stored in `fallback-users` localStorage key
- Login works with both API and localStorage users

## Setting Up PostgreSQL (Optional)

If you want to use the full database functionality:

### 1. Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS (using Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

### 2. Start PostgreSQL Service
```bash
# Windows
net start postgresql

# macOS
brew services start postgresql

# Ubuntu/Debian
sudo systemctl start postgresql
```

### 3. Create Database and User
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE panda_mart_kenya;

# Create user (optional)
CREATE USER panda_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE panda_mart_kenya TO panda_user;
```

### 4. Update Environment Variables
Create or update your `.env.local` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=panda_mart_kenya
DB_USER=postgres
DB_PASSWORD=your_password
```

### 5. Run Database Migrations
The application will automatically create the necessary tables when you first run it with a proper database connection.

## Testing the Application

### Without Database (Current Setup):
1. Try registering a new user
2. The system will use localStorage fallback
3. Complete the multi-stage registration
4. See your PandaID displayed
5. Login with the same credentials
6. Experience the onboarding flow

### With Database:
1. Set up PostgreSQL as described above
2. The application will use the real database
3. All features work the same way
4. Data persists between sessions

## Troubleshooting

### Common Issues:
1. **ECONNREFUSED 127.0.0.1:5432**: PostgreSQL is not running
   - Start the PostgreSQL service
   - Check if the port 5432 is available

2. **Authentication failed**: Wrong credentials
   - Check your `.env.local` file
   - Verify PostgreSQL user and password

3. **Database does not exist**: Database not created
   - Create the database manually as shown above

### Fallback System:
If you encounter database issues, the application will automatically fall back to localStorage, so you can continue testing all features without interruption.