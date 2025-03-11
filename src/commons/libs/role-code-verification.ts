import { Request, Response, NextFunction } from "express";

type Role = "PRO" | "CUST" | "ADMIN" | "STAFF" | "VANCUST";

interface RoleRequest extends Request {
  ROLE?: Role[];
}

const setRole = (roles: Role[]) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    req.ROLE = roles;
    next();
  };
};

const setVanCustRole = (
  req: RoleRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.ROLE && req.ROLE.length > 0) {
    req.ROLE.push("VANCUST");
  } else {
    req.ROLE = ["VANCUST"];
  }
  next();
};

export { setRole, setVanCustRole };
