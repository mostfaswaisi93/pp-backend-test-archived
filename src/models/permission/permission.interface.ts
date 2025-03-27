export interface IPermission {
  _id?: string;
  name: string;
  displayName: string;
  description: string;
  screenId: string;
  ACCESS: boolean;
  MENU_TYPE: "main-menu" | "sub-menu";
  ACCESS_LEVEL: "ADMIN" | "VIEW";
}
