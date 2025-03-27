import * as express from "express";
import AuthService from "../auth/auth-service";
import { CategoryService } from "./category-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import { Category } from "../../models/category/category.model";
import {
  create,
  update,
  getCategory,
  updateStatus,
} from "./category-validation";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";

export default class CategoryController implements Controller {
  public path = "/categories";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private categoryService: CategoryService = CategoryService.Instance;

  private static _instance: CategoryController;

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
    this.router.post("/create", superadminOnly, create, this.createCategory);
    this.router.get(
      "/getCategoryById/:_id",
      superadminOnly,
      getCategory,
      this.getCategoryById
    );
    this.router.get(
      "/getLastCategoryId",
      superadminOnly,
      this.getLastCategoryId
    );
    this.router.get("/", this.getCategories);
    this.router.get("/getCategoriesWithSSP", this.getCategoriesWithSSP);
    this.router.post("/getCategoryName", this.getCategoryName);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateCategory
    );
    this.router.put(
      "/updateCategoryStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateCategoryStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getCategory,
      this.deleteCategory
    );
  }

  public createCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const category = await this.categoryService.create(request.body);
      const message = "Category created successfully.";
      return this.httpResWrapper.success(response, message, category);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params._id
      );
      const message = "Category retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, category);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getLastCategoryId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await this.categoryService.getLastCategoryId();
      const message = "Last category retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, category);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getCategories = async (request: Request, response: Response) => {
    try {
      const categories = await this.categoryService.getCategories();
      const message = "Categories retrieved successfully";
      return this.httpResWrapper.success(response, message, categories);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public getCategoriesWithSSP = async (
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

  public getCategoryName = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const result = await this.categoryService.getCategoryName(request.body);

      if (result.error) {
        return this.httpResWrapper.success(response, result.message);
      }

      const categories = result.categories || [];

      if (categories.length > 0) {
        const message = "Categories fetched successfully.";
        return this.httpResWrapper.success(response, message, categories);
      } else {
        const message = "Categories not found.";
        return this.httpResWrapper.error(response, message);
      }
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedCategory = await this.categoryService.update(
        request.params._id,
        request.body
      );
      const message = "Category successfully updated.";
      return this.httpResWrapper.success(response, message, updatedCategory);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateCategoryStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedCategoryStatus = await this.categoryService.updateStatus(
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

  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.categoryService.delete(req.params._id);
      const message = "Category successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
