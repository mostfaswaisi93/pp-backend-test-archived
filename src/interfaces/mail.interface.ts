export interface NewPasswordInput {
  firstName: string;
  lastName: string;
  token: string;
  PORTAL_URL: string;
  email: string;
}
export interface RestPasswordInput {
  firstName: string;
  lastName: string;
  token: string;
  PORTAL_URL: string;
  email: string;
}
export interface OneTimePasswordInput {
  firstName: string;
  email: string;
  authCode: string;
}

export interface EmailNotification {
  body: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  notificationType: string;
}
