# Inventory Management System - Backend

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure `.env`:
    - Set `DB_USER` and `DB_PASS` for your MySQL instance.
    - Create a database named `ims_db` in MySQL.

3.  Run the server:
    ```bash
    npm run dev
    ```

## API Endpoints

-   **Auth**:
    -   `POST /api/auth/register`
    -   `POST /api/auth/login`
-   **Products**:
    -   `GET /api/products`
    -   `POST /api/products`
    -   `PUT /api/products/:id`
    -   `DELETE /api/products/:id`
-   **Operations**:
    -   `POST /api/operations`
    -   `GET /api/operations`
-   **Dashboard**:
    -   `GET /api/dashboard/kpis`
    -   `GET /api/dashboard/recent`
