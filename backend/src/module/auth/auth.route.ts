import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/send-otp", (req: Request, res: Response, next: NextFunction) => {
  AuthController.sendOtp(req, res, next);
});

router.post("/verify-otp", (req, res) => {
  res.send("OTP verified successfully");
});

export default router;
