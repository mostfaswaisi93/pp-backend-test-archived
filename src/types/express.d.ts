// src/types/express.d.ts
import { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}
