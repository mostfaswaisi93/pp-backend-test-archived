export interface ITruckStockingListDetail {
  itemId: string;
  itemName: string;
  partId: string;
  categoryCode: string;
  subCategory: string;
  manufacturer: string;
  vendor: string;
  qty: string;
  subTotal: string;
  purchasePrice: string;
  qtyOnTruck: string;
  orderStatus?: string;
  receiveStatus?: string;
  returnStatus?: string;
  description?: string;
}

export interface ITruckOrder {
  proId: string;
  loginId: string;
  proEmailId: string;
  trucklocationId: string;
  truckOrderId: string;
  locationId: string;
  staffId: string;
  managerId: string;
  description?: string;
  status: string;
  truckStockingListDetails: ITruckStockingListDetail[];
  staffNotes?: string;
  managerNotes?: string;
  totalCost: number;
  createdBy: string;
  updatedBy: string;
  files: object[];
  createdAt?: Date;
  updatedAt?: Date;
}
