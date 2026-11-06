# QuickMart setup (Windows PowerShell)

## 1. Extract and open
1. Extract `QuickMart.zip`.
2. Open the extracted `QuickMart` folder in VS Code.
3. Open a terminal in VS Code.

## 2. Create the MongoDB Atlas database connection
1. Sign in to MongoDB Atlas.
2. Create/select a project and create a free cluster.
3. Under **Database Access**, create a database user and remember its username/password.
4. Under **Network Access**, add your current IP address. For a temporary development test only, Atlas also allows `0.0.0.0/0`; this permits connections from anywhere and is less secure, so remove it after testing.
5. Open your cluster → **Connect** → **Drivers** → select Node.js and copy the URI.
6. In `backend/.env`, set `MONGO_URI` to your copied URI. Add `/quickmart` before the query string.
   Example:
   `MONGO_URI=mongodb+srv://DB_USER:DB_PASSWORD@cluster0.example.mongodb.net/quickmart?retryWrites=true&w=majority`
7. Replace `DB_USER`, `DB_PASSWORD`, and the cluster hostname. If the password contains reserved URI characters such as `@`, `#`, `/`, `:`, `?` or `%`, URL-encode the password.
8. Set a long random `JWT_SECRET`. Do not share or commit `.env`.

## 3. Backend
Open a terminal:

```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Edit `backend/.env` and enter your real Atlas connection string and JWT secret.

Then run:

```powershell
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`.

Test in a browser: `http://localhost:5000/api/health`

## 4. Frontend
Open a second terminal (leave backend running):

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

## 5. Demo admin
The seed command creates an admin account only if it does not already exist:
- Email: `admin@quickmart.local`
- Password: `Admin@12345`

Change this password immediately after first login in a real deployment. The starter does not include a password-change screen, so change the seeded password directly or update the seed script before using it.

## 6. Create your own admin account (recommended)
Register normally in the app, then use MongoDB Atlas → Browse Collections → `quickmart` → `users`.
Edit that user's `role` from `customer` to `admin`.
Log out and log in again so the new JWT contains the admin role.

## 7. Commands at a glance

Backend terminal:
```powershell
cd QuickMart\backend
npm install
Copy-Item .env.example .env
# Edit .env first
npm run seed
npm run dev
```

Frontend terminal:
```powershell
cd QuickMart\frontend
npm install
Copy-Item .env.example .env
npm run dev
```

## Troubleshooting
- `MongoDB connection failed`: verify the Atlas cluster is available, database user credentials, Network Access IP allowlist, and the exact hostname copied from Atlas.
- Password has special characters: URL-encode the password component, not the entire URI.
- `EADDRINUSE`: another process is using port 5000 or 5173; stop the old terminal or change the port.
- `Cannot find module`: run `npm install` in the relevant `backend` or `frontend` folder.
- Never paste your real `.env` or full MongoDB URI into chat or GitHub.
