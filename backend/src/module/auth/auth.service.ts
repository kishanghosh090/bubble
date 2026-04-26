import axios from "axios";
import { env } from "../../config/env";

type SendOtpResult =
  | { ok: true; mode: "otp" | "sms" }
  | { ok: false; message: string };

export class AuthService {
  static async sendOtp(
    phoneNumber: string,
    otp: string,
  ): Promise<SendOtpResult> {
    const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "").slice(-10);

    if (normalizedPhoneNumber.length !== 10) {
      return { ok: false, message: "Invalid phone number format" };
    }

    const requestConfig = {
      headers: {
        authorization: env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "otp",
          variables_values: otp,
          numbers: normalizedPhoneNumber,
        },
        requestConfig,
      );

      return { ok: true, mode: "otp" };
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 400 &&
        error.response?.data &&
        typeof error.response.data === "object" &&
        "status_code" in error.response.data &&
        error.response.data.status_code === 996
      ) {
        try {
          await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
              route: "q",
              message: `Your Bubble OTP is ${otp}`,
              language: "english",
              flash: 0,
              numbers: normalizedPhoneNumber,
            },
            requestConfig,
          );

          return { ok: true, mode: "sms" };
        } catch (fallbackError) {
          if (axios.isAxiosError(fallbackError)) {
            console.error("Error sending OTP (fallback SMS):", {
              status: fallbackError.response?.status,
              data: fallbackError.response?.data,
            });
          } else {
            console.error("Error sending OTP (fallback SMS):", fallbackError);
          }

          return {
            ok: false,
            message:
              "OTP API not enabled and fallback SMS also failed. Complete Fast2SMS website verification.",
          };
        }
      }

      if (axios.isAxiosError(error)) {
        console.error("Error sending OTP:", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error("Error sending OTP:", error);
      }

      return { ok: false, message: "Failed to send OTP" };
    }
  }

  verifyOtp(phoneNumber: string, otp: string): string {
    // Logic to verify the provided OTP for the given phone number
    return `OTP verified successfully for ${phoneNumber}`;
  }
}
