import { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      lang?: string;
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}
