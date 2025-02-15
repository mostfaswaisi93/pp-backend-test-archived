export interface PushNotification {
  notification: {
    title: string;
    body: string;
  };
  data?: {
    url: string;
    click_action: string;
    [key: string]: string;
  };
}
export interface SEND_NOTIFICATION_OPTIONS {
  bindingParameters?: BindingParameters;
  data?: any;
  body?: string;
  title?: string;
  urlParametersMobile?: string;
}
export interface BindingParameters {
  [key: string]: BindingParametersData;
}
export interface BindingParametersData {
  ar: string;
  en: string;
}

export interface NOTIFICATION_TARGET_FILTER {
  id: number;
  isEmailActive: boolean;
  email: string | null;
  firstName: string;
  lastName: string;
}
