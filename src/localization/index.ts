// export { ar } from "./ar";
// export { en } from "./en";

export interface Localization {
  [key: string]: { [key: string]: string };
}

export type Locals = {
  en: Localization;
  ar: Localization;
};

export const en: Localization = {
  error: {
    "user.notFound": "User not found",
  },
};

export const ar: Localization = {
  error: {
    "user.notFound": "المستخدم غير موجود",
  },
};

export const locals: Locals = {
  en,
  ar,
};
