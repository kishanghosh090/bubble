import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq, or } from "drizzle-orm";

export class UserController {
  static async getProfile(req: Request, res: Response) {}

  static async searchUsers(req: Request, res: Response) {
    const { query } = req.query as { query?: string };

    if (!query) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Query parameter is required"));
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phoneNumber: usersTable.phoneNumber,
      })
      .from(usersTable)
      .where(
        or(
          eq(usersTable.name, query),
          eq(usersTable.email, query),
          eq(usersTable.phoneNumber, query),
        ),
      )
      .limit(1);
    return res.json(new ApiResponse(200, user, "User found"));
  }
}
