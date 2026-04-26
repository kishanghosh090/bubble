import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

export class AuthController {
  static sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Call the AuthService to send the OTP
    const response = await AuthService.sendOtp(phone, otp);
    if (!response.ok) {
      return res.status(500).json(new ApiResponse(500, null, response.message));
    }

    const modeMessage =
      response.mode === "otp"
        ? "OTP sent successfully"
        : "OTP sent successfully (SMS fallback mode)";

    return res.status(200).json(new ApiResponse(200, null, modeMessage));
  });
}
