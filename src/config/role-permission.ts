export const roleStructure = {
  superadmin: {
    categories: "c,r,u,d",
    subcategories: "c,r,u,d",
    users: "c,r,u,d",
  },
  pro: {},
  lead: {},
  staff: {},
  customer: {},
};

export const permissionsMap: {
  c: string;
  r: string;
  u: string;
  d: string;
} = {
  c: "create",
  r: "read",
  u: "update",
  d: "delete",
};
