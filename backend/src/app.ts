import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { createServer } from "http";
import { Server } from "socket.io";
import initializeSocket from "./socket";
import { ApiError } from "./utils/ApiError";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

// error handling middleware
app.use(
  (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      const statusCode =
        typeof (err as { statusCode?: number }).statusCode === "number"
          ? (err as { statusCode?: number }).statusCode
          : typeof (err as { status?: number }).status === "number"
            ? (err as { status?: number }).status
            : 500;

      res.status(statusCode ? statusCode : 500).json({
        message: err.message || "Internal Server Error",
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
);
export default server;
