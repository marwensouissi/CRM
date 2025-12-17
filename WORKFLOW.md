# CRM Project Workflow

This document outlines the steps to invoke, run, and test the CRM application.

## Prerequisites

- PHP 8.2+
- Composer
- Node.js (v18+)
- SQLite (enabled in `php.ini`)

## 1. Backend Setup (Laravel)

The backend handles the API and database interactions.

1.  **Navigate to backend directory**:
    ```bash
    cd backend
    ```

2.  **Install Dependencies** (if not already installed):
    ```bash
    composer install
    ```

3.  **Environment Setup**:
    - Copy `.env.example` to `.env`.
    - Ensure `DB_CONNECTION=sqlite`.
    - Create the database file: `touch database/database.sqlite` (Linux/Mac) or `New-Item database/database.sqlite` (Windows PowerShell).

4.  **Database Migration & Seeding**:
    Refresh the database and seed it with test data (Admin user, clients, leads).
    ```bash
    php artisan migrate:fresh --seed
    ```
    *Default Admin Credentials:*
    - Email: `admin@flowcrm.com`
    - Password: `password`

5.  **Start the Server**:
    ```bash
    php artisan serve --port=8000
    ```
    The API will be available at `http://localhost:8000/api`.

## 2. Frontend Setup (Next.js)

The frontend is a React-based application located in `flow-crm`.

1.  **Navigate to frontend directory**:
    ```bash
    cd ../flow-crm
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 3. Testing APIs

To verify the system is working correctly, you can run the automated API verification script.

1.  **Run the verification script**:
    ```bash
    # From flow-crm directory
    node scripts/verify_api.js
    ```
    This script will:
    - Attempt to log in as `admin@flowcrm.com`.
    - Fetch and display the list of Leads.
    - Fetch and display Dashboard Stats.

## 4. Manual Verification

1.  Open [http://localhost:3000](http://localhost:3000).
2.  Login with `admin@flowcrm.com` / `password`.
3.  Navigate to "Leads" to see the Kanban board.
