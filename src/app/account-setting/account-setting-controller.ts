import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { AccountSettingService } from "./account-setting-service";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getAccountSetting,
  updateStatus,
  getAccountSettingsByLoginId,
  getAccountSettingsSubCategories,
  deleteStaffRolesValidation,
  deletePriceBookSubCatValidation,
  deleteEquipmentStatusValidation,
  deleteEquipmentItemTypeValidation,
  deletePreWorkInspectionFormValidation,
  insertInventorySubSubCatValidation,
  deleteInventorySubSubCatValidation,
  deleteInventoryValidation,
  getPriceBookSubcategoryByCategoryValidation,
  getPriceBookCategoriesFromAccValidation,
  updateaccountSettingsRolePermissionsValidation,
  deleteVendorsValidation,
  deleteSaleseMarketingValidation,
  deleteEquipmentStatusByIdValidation,
} from "./account-setting-validation";

export default class AccountSettingController implements Controller {
  public path = "/account-settings";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private accountSettingService: AccountSettingService =
    AccountSettingService.Instance;

  private static _instance: AccountSettingController;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const { authenticate, checkRole } = AuthService.Instance;
    const superadminOnly = [
      authenticate,
      checkRole.bind(AuthService.Instance, "SUPERADMIN"),
    ];
    this.router.post(
      "/create",
      superadminOnly,
      create,
      this.createAccountSetting
    );
    this.router.get(
      "/getAccountSettingById/:_id",
      superadminOnly,
      getAccountSetting,
      this.getAccountSettingById
    );
    this.router.get("/", this.getAccountSettings);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateAccountSetting
    );
    this.router.put(
      "/updateAccountSettingStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateAccountSettingStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getAccountSetting,
      this.deleteAccountSetting
    );
    this.router.post(
      "/insertAccountsetting",
      superadminOnly,
      create,
      this.insertAccountsetting
    );
    this.router.get(
      "/getAccountSettingsByLoginId/:loginId",
      getAccountSettingsByLoginId,
      this.getAccountSettingsByLoginId
    );
    this.router.get(
      "/getAccountSettingsSubCategories/:loginId/:mainCategory",
      getAccountSettingsSubCategories,
      this.getAccountSettingsSubCategories
    );
    this.router.delete(
      "/deleteStaffRoles/:loginId",
      superadminOnly,
      deleteStaffRolesValidation,
      this.deleteStaffRoles
    );
    this.router.delete(
      "/deletePriceBookSubCat/:loginId/:mainCategory/:subCategoryId",
      superadminOnly,
      deletePriceBookSubCatValidation,
      this.deletePriceBookSubCat
    );
    this.router.delete(
      "/deleteEquipmentStatus/:loginId/:equipmentStatusId",
      superadminOnly,
      deleteEquipmentStatusValidation,
      this.deleteEquipmentStatus
    );
    this.router.delete(
      "/deleteEquipmentItemType/:loginId/:itemTypeId",
      superadminOnly,
      deleteEquipmentItemTypeValidation,
      this.deleteEquipmentItemType
    );
    this.router.delete(
      "/deletePreWorkInspectionForm/:loginId/:formId",
      superadminOnly,
      deletePreWorkInspectionFormValidation,
      this.deletePreWorkInspectionForm
    );
    this.router.post(
      "/insertInventorySubSubCat",
      superadminOnly,
      insertInventorySubSubCatValidation,
      this.insertInventorySubSubCat
    );
    this.router.put(
      "/updatePaymentGateway/:loginId/:gatewayId",
      superadminOnly,
      insertInventorySubSubCatValidation,
      this.updatePaymentGateway
    );
    this.router.delete(
      "/deleteInventorySubSubCat",
      superadminOnly,
      deleteInventorySubSubCatValidation,
      this.deleteInventorySubSubCat
    );
    this.router.delete(
      "/deleteInventory/:loginId/:inventoryId",
      superadminOnly,
      deleteInventoryValidation,
      this.deleteInventory
    );
    this.router.get(
      "/getPriceBookSubcategoryByCategory/:loginId/:mainCategory",
      superadminOnly,
      getPriceBookSubcategoryByCategoryValidation,
      this.getPriceBookSubcategoryByCategory
    );
    this.router.get(
      "/getPriceBookCategoriesFromAcc/:loginId",
      superadminOnly,
      getPriceBookCategoriesFromAccValidation,
      this.getPriceBookCategoriesFromAcc
    );
    this.router.put(
      "/updateAccountSettings/:loginId",
      superadminOnly,
      update,
      this.updateAccountSettingsByLoginId
    );
    this.router.put(
      "/updateAccountSettingsRolePermissions/:loginId",
      superadminOnly,
      updateaccountSettingsRolePermissionsValidation,
      this.updateaccountSettingsRolePermissions
    );
    this.router.delete(
      "/deletePostWorkInspectionForm/:loginId/:formId",
      superadminOnly,
      deletePreWorkInspectionFormValidation,
      this.deletePostWorkInspectionForm
    );
    this.router.delete(
      "/deleteVendors/:loginId/:vendorCategory",
      superadminOnly,
      deleteVendorsValidation,
      this.deleteVendors
    );
    this.router.delete(
      "/deleteSaleseMarketing/:loginId/:sourceType",
      superadminOnly,
      deleteSaleseMarketingValidation,
      this.deleteSaleseMarketing
    );
    this.router.delete(
      "/deleteEquipmentStatusById/:loginId/:equipmentStatusId",
      superadminOnly,
      deleteEquipmentStatusByIdValidation,
      this.deleteEquipmentStatusById
    );
  }

  public createAccountSetting = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const accountSetting = await this.accountSettingService.create(
        request.body
      );
      const message = "Account setting created successfully.";
      return this.httpResWrapper.success(response, message, accountSetting);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getAccountSettingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accountSetting =
        await this.accountSettingService.getAccountSettingById(req.params._id);
      const message = "Account setting retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, accountSetting);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getAccountSettings = async (request: Request, response: Response) => {
    try {
      const accountSettings =
        await this.accountSettingService.getAccountSettings();
      const message = "Account settings retrieved successfully";
      return this.httpResWrapper.success(response, message, accountSettings);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAccountSetting = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAccountSetting = await this.accountSettingService.update(
        request.params._id,
        request.body
      );
      const message = "Account setting successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAccountSetting
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateAccountSettingStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedAccountSettingStatus =
        await this.accountSettingService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Account setting status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedAccountSettingStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteAccountSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.accountSettingService.delete(req.params._id);
      const message = "Account setting successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public insertAccountsetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const setting = await this.accountSettingService.insertAccountsetting(
        req.body
      );
      const message = "Account setting inserted successfully.";
      return this.httpResWrapper.success(res, message, setting);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getAccountSettingsByLoginId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const loginId = req.params.loginId;
      const accountSettings =
        await this.accountSettingService.getAccountSettingsByLoginId(loginId);
      const message = "Account settings retrieved successfully by loginId.";
      return this.httpResWrapper.success(res, message, accountSettings);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getAccountSettingsSubCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, mainCategory } = req.params;
      const result =
        await this.accountSettingService.getAccountSettingsSubCategories(
          loginId,
          mainCategory
        );
      const message =
        "Account settings with specific sub-categories retrieved successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deleteStaffRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.accountSettingService.deleteStaffRoles(
        req.params.loginId
      );
      return this.httpResWrapper.success(res, result.message, result.data);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deletePriceBookSubCat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, mainCategory, subCategoryId } = req.params;
      const result = await this.accountSettingService.deletePriceBookSubCat(
        loginId,
        mainCategory,
        subCategoryId
      );
      const message = "SubCategory deleted successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deleteEquipmentStatus = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { loginId, equipmentStatusId } = request.params;
      const result = await this.accountSettingService.deleteEquipmentStatus(
        loginId,
        equipmentStatusId
      );
      const message = "Equipment status deleted successfully.";
      return this.httpResWrapper.success(response, message, result);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteEquipmentItemType = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, itemTypeId } = request.params;
      const result = await this.accountSettingService.deleteEquipmentItemType(
        loginId,
        itemTypeId
      );
      return this.httpResWrapper.success(
        response,
        result.message,
        result.result
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deletePreWorkInspectionForm = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, formId } = request.params;
      const result =
        await this.accountSettingService.deletePreWorkInspectionForm(
          loginId,
          formId
        );
      this.httpResWrapper.success(response, result);
    } catch (error) {
      next(error);
    }
  };

  private async insertInventorySubSubCat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { loginId, mainCategory, subCategoryId, newSubSubCategory } =
        req.body;
      const result = await this.accountSettingService.insertInventorySubSubCat(
        loginId,
        mainCategory,
        subCategoryId,
        newSubSubCategory
      );
      this.httpResWrapper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  private async updatePaymentGateway(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { loginId, gatewayId } = req.params;
      const updatedData = req.body;

      const result = await this.accountSettingService.updatePaymentGateway(
        loginId,
        gatewayId,
        updatedData
      );

      this.httpResWrapper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  private async deleteInventorySubSubCat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { loginId, mainCategory, subCategoryId, subSubCategoryId } =
        req.body;
      const result =
        await AccountSettingService.Instance.deleteInventorySubSubCat(
          loginId,
          mainCategory,
          subCategoryId,
          subSubCategoryId
        );
      this.httpResWrapper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  public deleteInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, inventoryId } = req.params;
      const result = await this.accountSettingService.deleteInventory(
        loginId,
        inventoryId
      );
      const message = "Inventory item deleted successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPriceBookSubcategoryByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, mainCategory } = req.params;
      const result =
        await this.accountSettingService.getPriceBookSubcategoryByCategory(
          loginId,
          mainCategory
        );
      const message = "Price book subcategories retrieved successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getPriceBookCategoriesFromAcc = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId } = req.params;
      const categories =
        await this.accountSettingService.getPriceBookCategoriesFromAcc(loginId);
      const message = "Price book categories retrieved successfully.";
      return this.httpResWrapper.success(res, message, categories);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public updateAccountSettingsByLoginId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId } = req.params;
      const data = req.body;

      const result = await this.accountSettingService.updateaccountSetting(
        loginId,
        data
      );

      const message = "Account setting updated successfully by loginId.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public updateaccountSettingsRolePermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId } = req.params;
      const { roleCode, permissions } = req.body;

      const result =
        await this.accountSettingService.updateaccountSettingsRolePermissions(
          loginId,
          roleCode,
          permissions
        );

      const message = "Account settings role permissions updated successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deletePostWorkInspectionForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, formId } = req.params;
      const result =
        await this.accountSettingService.deletePostWorkInspectionForm(
          loginId,
          formId
        );
      const message = "Post-work inspection form deleted successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deleteVendors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, vendorCategory } = req.params;
      const result = await this.accountSettingService.deleteVendors(
        loginId,
        vendorCategory
      );
      const message = "Vendors deleted successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public deleteSaleseMarketing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, sourceType } = req.params;

      const result = await this.accountSettingService.deleteSaleseMarketing(
        loginId,
        sourceType
      );

      const message = "Marketing media type deleted successfully.";
      return this.httpResWrapper.success(res, message, result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
  public deleteEquipmentStatusById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { loginId, equipmentStatusId } = req.params;
      const result = await this.accountSettingService.deleteEquipmentStatusById(
        loginId,
        equipmentStatusId
      );
      return this.httpResWrapper.success(res, result.message, result.result);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
