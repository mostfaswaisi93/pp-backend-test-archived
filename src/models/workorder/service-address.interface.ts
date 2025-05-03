export interface IServiceAddress {
  _id: string;
  // Changed 'emailId' to 'email' for clarity and common usage
  flagStatus?: string;
  customerName?: string;

  // Changed 'emailId' to 'email' for simplicity and standard naming
  email?: string;

  firstName?: string;
  lastName?: string;

  // Changed 'phoneNumber' to 'phone' for conciseness
  phone?: string;

  // 'phoneType' remains as is, but could be renamed to 'phoneCategory' if necessary for better clarity
  phoneType?: string;

  streetAddress?: string;
  zipcode?: string;
  unit?: string;
  city?: string;
  state?: string;
  county?: string;

  adminNotes?: string;
  latitude?: number;
  longitude?: number;

  // Changed 'serviceCustomerType' to 'customerType' for simplicity and clarity
  customerType?: string;
}
