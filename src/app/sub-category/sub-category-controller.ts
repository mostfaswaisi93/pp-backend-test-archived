import * as express from "express";
import AuthService from "../auth/auth-service";
import { NextFunction, Request, Response } from "express";
import { SubCategoryService } from "./sub-category-service";
import Controller from "../../interfaces/controller.interface";
import { Category } from "../../models/category/category.model";
import {
  create,
  update,
  getSubCategory,
  updateStatus,
} from "./sub-category-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class SubCategoryController implements Controller {
  public path = "/subcategories";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private subCategoryService: SubCategoryService = SubCategoryService.Instance;

  private static _instance: SubCategoryController;

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
      checkRole.bind(AuthService.Instance, "superadmin"),
    ];
    this.router.post("/create", superadminOnly, create, this.createSubCategory);
    this.router.get(
      "/getSubCategoryById/:_id",
      superadminOnly,
      getSubCategory,
      this.getSubCategoryById
    );
    this.router.get(
      "/getLastSubCategoryId",
      superadminOnly,
      this.getLastSubCategoryId
    );
    this.router.get("/", this.getSubCategories);
    this.router.get("/getSubCategoriesWithSSP", this.getSubCategoriesWithSSP);
    // this.router.post("/getSubCategoryName", this.getSubCategoryName);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateSubCategory
    );
    this.router.put(
      "/updateSubCategoryStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateSubCategoryStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getSubCategory,
      this.deleteSubCategory
    );
  }

  public createSubCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const category = await this.subCategoryService.create(request.body);
      const message = "Category created successfully.";
      return this.httpResWrapper.success(response, message, category);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getSubCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await this.subCategoryService.getSubCategoryById(
        req.params._id
      );
      const message = "Category retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, category);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLastSubCategoryId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await this.subCategoryService.getLastSubCategoryId();
      const message = "Last category retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, category);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getSubCategories = async (request: Request, response: Response) => {
    try {
      const categories = await this.subCategoryService.getSubCategories();
      const message = "Categories retrieved successfully";
      return this.httpResWrapper.success(response, message, categories);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getSubCategoriesWithSSP = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const searchKey = req.body.searchKey ? req.body.searchKey.trim() : "";

      const regex = new RegExp(
        searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      const searchQuery = searchKey
        ? { $or: [{ categoryName: { $regex: regex } }] }
        : {};

      const total = await Category.countDocuments(searchQuery);

      const categories = await Category.find(searchQuery)
        .sort({ categoryName: 1 })
        .limit(limit)
        .skip((page - 1) * limit);

      return this.httpResWrapper.success(
        res,
        "Fetched categories successfully",
        {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
          data: categories,
        }
      );
    } catch (error: any) {
      this.httpResWrapper.error(res, error.message);
    }
  };

  // public getSubCategoryName = async (
  //   request: Request,
  //   response: Response
  // ): Promise<void> => {
  //   try {
  //     const result = await this.subCategoryService.getSubCategoryName(
  //       request.body
  //     );

  //     if (result.error) {
  //       return this.httpResWrapper.success(response, result.message);
  //     }

  //     const categories = result.categories || [];

  //     if (categories.length > 0) {
  //       const message = "Categories fetched successfully.";
  //       return this.httpResWrapper.success(response, message, categories);
  //     } else {
  //       const message = "Categories not found.";
  //       return this.httpResWrapper.error(response, message);
  //     }
  //   } catch (error) {
  //     return this.httpResWrapper.error(response, error);
  //   }
  // };

  public updateSubCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedCategory = await this.subCategoryService.update(
        request.params._id,
        request.body
      );
      const message = "Category successfully updated.";
      return this.httpResWrapper.success(response, message, updatedCategory);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateSubCategoryStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedCategoryStatus = await this.subCategoryService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Category status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedCategoryStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteSubCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.subCategoryService.delete(req.params._id);
      const message = "Category successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
