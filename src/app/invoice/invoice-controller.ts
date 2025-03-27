import * as express from "express";
import AuthService from "../auth/auth-service";
import { InvoiceService } from "./invoice-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { create, update, getInvoice, updateStatus } from "./invoice-validation";

export default class InvoiceController implements Controller {
  public path = "/invoices";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private invoiceService: InvoiceService = InvoiceService.Instance;

  private static _instance: InvoiceController;

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
    this.router.post("/create", superadminOnly, create, this.createInvoice);
    this.router.get(
      "/getInvoiceById/:_id",
      superadminOnly,
      getInvoice,
      this.getInvoiceById
    );
    this.router.get("/", this.getInvoices);
    this.router.put("/update/:_id", superadminOnly, update, this.updateInvoice);
    this.router.put(
      "/updateInvoiceStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateInvoiceStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getInvoice,
      this.deleteInvoice
    );
  }

  public createInvoice = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const invoice = await this.invoiceService.create(request.body);
      const message = "Invoice created successfully.";
      return this.httpResWrapper.success(response, message, invoice);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getInvoiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const invoice = await this.invoiceService.getInvoiceById(req.params._id);
      const message = "Invoice retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, invoice);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getInvoices = async (request: Request, response: Response) => {
    try {
      const invoices = await this.invoiceService.getInvoices();
      const message = "Invoices retrieved successfully";
      return this.httpResWrapper.success(response, message, invoices);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateInvoice = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedInvoice = await this.invoiceService.update(
        request.params._id,
        request.body
      );
      const message = "Invoice successfully updated.";
      return this.httpResWrapper.success(response, message, updatedInvoice);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateInvoiceStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedInvoiceStatus = await this.invoiceService.updateStatus(
        request.params._id,
        request.body
      );
      const message = "Invoice status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedInvoiceStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.invoiceService.delete(req.params._id);
      const message = "Invoice successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
