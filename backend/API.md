# QuickMart API reference

Base URL: `http://localhost:5000/api`

Authentication: send `Authorization: Bearer YOUR_JWT_TOKEN` for protected routes.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create customer account |
| POST | `/auth/login` | Public | Login |
| GET | `/products` | Public | List products (`?search=` and `?category=` supported) |
| GET | `/products/:id` | Public | Product details |
| POST | `/products` | Admin | Add product |
| PUT | `/products/:id` | Admin | Edit product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/cart` | Customer | Get cart |
| POST | `/cart` | Customer | Add product (`productId`, `quantity`) |
| PATCH | `/cart/:productId` | Customer | Change quantity |
| DELETE | `/cart/:productId` | Customer | Remove product |
| POST | `/orders` | Customer | Place COD order (`deliveryAddress`) |
| GET | `/orders/my` | Customer | My orders |
| GET | `/orders` | Admin | All orders |
| PATCH | `/orders/:id/status` | Admin | Change order status |
| GET | `/health` | Public | API health check |
