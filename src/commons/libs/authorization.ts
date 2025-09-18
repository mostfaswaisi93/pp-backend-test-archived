"use strict";

import { Request } from "express";
import db from "../../models";
import { UserAccessService } from "../../app/user/user-access-service";

const Customers = db.ProCustomer;
const Staff = db.Staff;

interface AuthRequest extends Request {
  doc: {
    id: string;
    userId: string; // User ID for Access Control service
  };
  user?: {
    _id: string;
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
    const userAccessService = UserAccessService.Instance;
    const userId = req.user?._id || req.doc.userId;

    if (!userId) {
      throw new Error("User ID not found in request");
    }

    // Check if user is admin/superadmin - they have full access
    const isAdmin = await userAccessService.userHasAnyRole(userId, [
      "admin",
      "SUPERADMIN",
    ]);
    if (isAdmin) return;

    if (allowedTo === "PRO" || allowedTo === "BOTH") {
      const isPro = await userAccessService.userHasRole(userId, "pro");
      if (isPro && proLoginId !== req.doc.id) {
        throw new Error("Not Allowed");
      }

      const isStaff = await userAccessService.userHasRole(userId, "staff");
      if (isStaff) {
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
      const isCustomer = await userAccessService.userHasAnyRole(userId, [
        "pro_customer",
        "customer",
      ]);
      if (isCustomer) {
        const customerData = (await Customers.findOne(
          { _id: customerId },
          { loginId: 1 }
        ).lean()) as any;
        if (!customerData?.loginId)
          throw new Error("Customer Data Missing Login Id");
        if (req.doc.id !== customerData.loginId) throw new Error("Not Allowed");
      }
    }

    // Check role-based restrictions
    if (allowedTo === "PRO") {
      const isCustomer = await userAccessService.userHasAnyRole(userId, [
        "pro_customer",
        "customer",
      ]);
      if (isCustomer) {
        throw new Error("Not Allowed");
      }
    }

    if (allowedTo === "CUSTOMER") {
      const isProOrStaff = await userAccessService.userHasAnyRole(userId, [
        "pro",
        "staff",
      ]);
      if (isProOrStaff) {
        throw new Error("Not Allowed");
      }
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
    const userAccessService = UserAccessService.Instance;
    const userId = req.user?._id || req.doc.userId;

    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const isStaff = await userAccessService.userHasRole(userId, "staff");
    if (isStaff) {
      // Check specific permissions for estimates and invoices
      const hasEstimatePermission = await userAccessService.userHasPermission(
        userId,
        "estimate_management.read"
      );
      const hasInvoicePermission = await userAccessService.userHasPermission(
        userId,
        "invoice_management.read"
      );

      if (type === "ESTIMATE" && !hasEstimatePermission) {
        throw new Error("No permission for estimates");
      }

      if (type === "INVOICE" && !hasInvoicePermission) {
        throw new Error("No permission for invoices");
      }

      // Check if staff has write permissions (not just read)
      const hasEstimateWritePermission =
        await userAccessService.userHasPermission(
          userId,
          "estimate_management.update"
        );
      const hasInvoiceWritePermission =
        await userAccessService.userHasPermission(
          userId,
          "invoice_management.update"
        );

      if (type === "INVOICE" && !hasInvoiceWritePermission) {
        throw new Error("Staff Has View Access Level");
      }
      if (type === "ESTIMATE" && !hasEstimateWritePermission) {
        throw new Error("Staff Has View Access Level");
      }

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
      } else if (req.doc.id !== primaryStaffData.managerLoginId?.toString()) {
        throw new Error("Not Allowed");
      }
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
};
