# Full-Stack Flutter + Node.js + MongoDB Backend

A production-ready Node.js & Express REST API powered by **MongoDB** (NoSQL with Mongoose), architected as a drop-in NoSQL equivalent to `flutter_supabase_backend`.

---

## 🚀 Features

- **NoSQL Database with MongoDB Atlas & Mongoose**: Flexible schema models for users and products.
- **JWT Authentication**: Secure user registration and login using `bcryptjs` and `jsonwebtoken`.
- **Drop-in Compatibility**: Retains exact same endpoint contracts and response payloads as `flutter_supabase_backend`.
- **Flutter & Emulator Ready**: Listens on `0.0.0.0` for seamless access from iOS Simulators, Android Emulators (`10.0.2.2`), and physical devices on the local LAN.

---

## 📁 Project Structure

```
flutter_mongodb/
├── package.json
├── .env
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── config/
    │   └── db.js              # MongoDB Mongoose connection handler
    ├── models/
    │   ├── User.js            # User Mongoose schema & auth helpers
    │   └── Product.js         # Product Mongoose schema
    ├── middlewares/
    │   └── authMiddleware.js  # JWT authentication verification
    ├── controllers/
    │   ├── authController.js  # Signup, login, profile logic
    │   └── productController.js # Product listing & creation logic
    ├── routes/
    │   ├── authRoutes.js      # /api/auth routes
    │   └── productRoutes.js   # /api/products routes
    └── server.js              # Main Express server entrypoint
```

---

## 🌐 API Endpoints

### 1. Health Checks
- `GET /` — API welcome message & available routes
- `GET /api/health` — Service health status check

### 2. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user (`email`, `password`, `name`) | No |
| `POST` | `/api/auth/login` | Authenticate user (`email`, `password`) | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (`Bearer <token>`) |

### 3. Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Fetch list of all products | Optional |
| `POST` | `/api/products` | Create product (`title`, `price`, `description`, `image_url`) | Yes (`Bearer <token>`) |

---

## 🛠️ How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/flutter_db?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Start server in development mode (with hot-reload):
   ```bash
   npm run dev
   ```
   Or production mode:
   ```bash
   npm start
   ```
