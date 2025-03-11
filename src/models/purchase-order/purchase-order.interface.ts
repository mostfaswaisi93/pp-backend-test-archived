export interface IPurchaseOrder {
  workOrderNumber: string;
  workOrderId: string;
  woStatus: string;
  customerName: string;
  customerId: string;
  phoneNumber: string;
  jobTitle: string;
  location: string;
  staffId: string;
  status: string;
  staffNotes?: string;
  managerNotes?: string;
  purchaseOrderDetails: object[];
  totalCost: number;
  proId: string;
  loginId: string;
  proEmailId: string;
  purchaseOrderId: string;
  description: string;
  files: object[];
  createdBy: string;
  updatedBy: string;
}
