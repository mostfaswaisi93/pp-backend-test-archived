import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";

export default class User2Controller implements Controller {
  public path = "/users";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getUsers);
    this.router.post("/", this.createUser);
  }

  private getUsers(req: Request, res: Response) {
    res.json({ message: "Get Users" });
  }

  private createUser(req: Request, res: Response) {
    res.json({ message: "User Created" });
  }
}
