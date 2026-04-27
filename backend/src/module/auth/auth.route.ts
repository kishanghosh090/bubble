import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { AuthController } from "./auth.controller";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { env } from "../../config/env";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/send-otp", (req: Request, res: Response, next: NextFunction) => {
  AuthController.sendOtp(req, res, next);
});

router.post("/verify-otp", (req, res) => {
  res.send("OTP verified successfully");
});
router.post("/auth/google", async (req: Request, res: Response) => {
  const { idToken } = req.body as { idToken?: string };
  console.log(idToken);

  if (!idToken) {
    throw new ApiError(400, "idToken is required");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new ApiError(401, "Invalid Google token payload");
  }

  const email = payload.email.toLowerCase();
  const name = payload.name?.trim() || email.split("@")[0] || "User";

  const existingUsers = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  const user =
    existingUsers[0] ||
    (
      await db
        .insert(usersTable)
        .values({
          email,
          name,
          age: 18,
        })
        .returning()
    )[0];

  if (!user) {
    throw new ApiError(500, "Failed to create or load user");
  }

  const accessToken = jwt.sign(
    { id: String(user.id) },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { id: String(user.id) },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { accessToken, refreshToken }, "Login successful"),
    );
});
export default router;
