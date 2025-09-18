import * as express from "express";
import AuthService from "../auth/auth-service";
import { TransactionService } from "./transaction-service";
import { NextFunction, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import {
  create,
  update,
  getTransaction,
  updateStatus,
} from "./transaction-validation";

export default class TransactionController implements Controller {
  public path = "/transactions";
  public router = express.Router();
  public middleware: any[] = [];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private transactionService: TransactionService = TransactionService.Instance;

  private static _instance: TransactionController;

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
    this.router.post("/create", superadminOnly, create, this.createTransaction);
    this.router.get(
      "/getTransactionById/:_id",
      superadminOnly,
      getTransaction,
      this.getTransactionById
    );
    this.router.get("/", this.getTransactions);
    this.router.put(
      "/update/:_id",
      superadminOnly,
      update,
      this.updateTransaction
    );
    this.router.put(
      "/updateTransactionStatus/:_id",
      superadminOnly,
      updateStatus,
      this.updateTransactionStatus
    );
    this.router.delete(
      "/delete/:_id",
      superadminOnly,
      getTransaction,
      this.deleteTransaction
    );
  }

  public createTransaction = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const transaction = await this.transactionService.create(request.body);
      const message = "Transaction created successfully.";
      return this.httpResWrapper.success(response, message, transaction);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  public getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transaction = await this.transactionService.getTransactionById(
        req.params._id
      );
      const message = "Transaction retrieved successfully by ID.";
      return this.httpResWrapper.success(res, message, transaction);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };

  public getTransactions = async (request: Request, response: Response) => {
    try {
      const transactions = await this.transactionService.getTransactions();
      const message = "Transactions retrieved successfully";
      return this.httpResWrapper.success(response, message, transactions);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateTransaction = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedTransaction = await this.transactionService.update(
        request.params._id,
        request.body
      );
      const message = "Transaction successfully updated.";
      return this.httpResWrapper.success(response, message, updatedTransaction);
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public updateTransactionStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updatedTransactionStatus =
        await this.transactionService.updateStatus(
          request.params._id,
          request.body
        );
      const message = "Transaction status successfully updated.";
      return this.httpResWrapper.success(
        response,
        message,
        updatedTransactionStatus
      );
    } catch (error) {
      return this.httpResWrapper.error(response, error);
    }
  };

  public deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.transactionService.delete(req.params._id);
      const message = "Transaction successfully deleted.";
      return this.httpResWrapper.success(res, message);
    } catch (error) {
      return this.httpResWrapper.error(res, error);
    }
  };
}
