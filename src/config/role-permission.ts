export const roleStructure = {
  SUPERADMIN: {
    categories: "c,r,u,d",
    subcategories: "c,r,u,d",
    users: "c,r,u,d",
  },
  PRO: {},
  STAFF: {},
  CUSTOMER: {},
  VANCUSTOMER: {},
};

export const permissionsMap: {
  c: string;
  r: string;
  u: string;
  d: string;
  a: string;
  x: string;
  i: string;
  s: string;
  m: string;
} = {
  c: "create",
  r: "read",
  u: "update",
  d: "delete",
  a: "approve",
  x: "export",
  i: "import",
  s: "share",
  m: "manage",
};
