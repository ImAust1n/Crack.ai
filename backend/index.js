import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/libs/db.js"
import authRoutes from "./src/routes/auth.route.js";
import emailRoutes from "./src/routes/email.route.js";

dotenv.config()

const PORT = process.env.PORT;

// import { getData } from "./waste.js";
// getData();

const app = express()

app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:8080", 
  "https://8159-205-254-163-34.ngrok-free.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // Handle Preflight Requests
      if (req.method === "OPTIONS") {
          return res.sendStatus(200);
      }
  }

  next();
});


app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.get('/', (req, res) => {
    res.status(200).json({ message: "API Server is Live" });
})

// Use Routes
app.use('/api/auth', authRoutes);

app.use('/api/email', emailRoutes);

app.use('/api/check', (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

// Connect to the database first, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
