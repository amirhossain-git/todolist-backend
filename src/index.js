const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();

async function bootstrap() {
  await connectDB(process.env.MONGODB_URI);

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: false
    })
  );
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, uptime: process.uptime() });
  });

  app.use("/api/todos", todoRoutes);

  app.use(notFound);
  app.use(errorHandler);

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});

