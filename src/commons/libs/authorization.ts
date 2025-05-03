"use strict";

import { Request } from "express";
import db from "../../models";
import { Document, Types } from "mongoose";

const Customers = db.ProCustomer;
const Staff = db.Staff;
const Login = db.User;

interface AuthRequest extends Request {
  doc: {
    id: string;
    rbac: { roleCode: string }[];
  };
}

interface CheckAuthorizationParams {
  req: AuthRequest;
  proLoginId: string;
  customerId: string;
  allowedTo: "PRO" | "CUSTOMER" | "BOTH";
}

export const checkAuthorization = async ({
  req,
  proLoginId,
  customerId,
  allowedTo,
}: CheckAuthorizationParams): Promise<void> => {
  try {
    if (req.doc.rbac[0].roleCode === "ADMIN") return;

    if (allowedTo === "PRO" || allowedTo === "BOTH") {
      if (req.doc.rbac[0].roleCode === "PRO" && proLoginId !== req.doc.id)
        throw new Error("Not Allowed");
      if (req.doc.rbac[0].roleCode === "STAFF") {
        const staffData = await Staff.findOne(
          { loginId: req.doc.id },
          { parentLoginId: 1 }
        ).lean();
        if (!staffData?.parentLoginId)
          throw new Error("Staff Data Missing Parent Login Id");
        if (proLoginId !== staffData.parentLoginId)
          throw new Error("Not Allowed");
      }
    }

    if (allowedTo === "CUSTOMER" || allowedTo === "BOTH") {
      if (
        req.doc.rbac[0].roleCode === "CUST" ||
        req.doc.rbac[0].roleCode === "VANCUST"
      ) {
        const customerData = await Customers.findOne(
          { _id: customerId },
          { loginId: 1 }
        ).lean();
        if (!customerData?.loginId)
          throw new Error("Customer Data Missing Login Id");
        if (req.doc.id !== customerData.loginId) throw new Error("Not Allowed");
      }
    }

    if (
      allowedTo === "PRO" &&
      ["CUST", "VANCUST"].includes(req.doc.rbac[0].roleCode)
    ) {
      throw new Error("Not Allowed");
    }

    if (
      allowedTo === "CUSTOMER" &&
      ["PRO", "STAFF"].includes(req.doc.rbac[0].roleCode)
    ) {
      throw new Error("Not Allowed");
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};

interface CheckStaffPermissionsParams {
  req: AuthRequest;
  type: "INVOICE" | "ESTIMATE";
  data: any;
}

export const checkStaffPermissionsForEstimateAndInvoice = async ({
  req,
  type,
  data,
}: CheckStaffPermissionsParams): Promise<void> => {
  try {
    if (req.doc.rbac[0].roleCode === "STAFF") {
      const staffData = await Login.findOne(
        { _id: req.doc.id },
        { rbac2: 1 }
      ).lean();
      if (!staffData?.rbac2?.[0]?.permissions)
        throw new Error("Invalid Staff Permissions");

      const permissions = staffData.rbac2[0].permissions;
      const ESPermissions = permissions.find(
        (item: any) => item.screenId === "ESTIMATES"
      );
      const INVPermissions = permissions.find(
        (item: any) => item.screenId === "INVOICES"
      );

      if (type === "INVOICE" && INVPermissions?.ACCESS_LEVEL === "VIEW")
        throw new Error("Staff Has View Access Level");
      if (type === "ESTIMATE" && ESPermissions?.ACCESS_LEVEL === "VIEW")
        throw new Error("Staff Has View Access Level");

      let primaryStaffData;
      if (type === "INVOICE") {
        primaryStaffData = await Staff.findOne(
          { loginId: data.primaryTech?.id },
          { managerLoginId: 1, invoicesReqMgApproval: 1 }
        ).lean();
      } else {
        primaryStaffData = await Staff.findOne(
          { loginId: data.primaryStaffObjectId },
          { managerLoginId: 1, estimatesReqMgApproval: 1 }
        ).lean();
      }

      if (!primaryStaffData) throw new Error("Primary Staff Data Not Found");

      if (
        req.doc.id ===
        (type === "INVOICE" ? data.primaryTech?.id : data.primaryStaffObjectId)
      ) {
        if (primaryStaffData.managerLoginId) {
          if (
            (type === "INVOICE" && primaryStaffData.invoicesReqMgApproval) ||
            (type === "ESTIMATE" && primaryStaffData.estimatesReqMgApproval)
          ) {
            throw new Error(
              "Refund, Void And Write-Off Can Only Be Done By Manager"
            );
          }
        }
      } else if (req.doc.id !== primaryStaffData.managerLoginId) {
        throw new Error("Not Allowed");
      }
    }
  } catch (e) {
    throw new Error(e.message);
  }
};
