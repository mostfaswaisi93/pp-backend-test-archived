import { NextFunction, Request, Response } from "express";
import * as express from "express";
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { UserService } from "./user-service";
import { validate } from "class-validator";
import AuthService from "../auth/auth-service";
import { getUser, create, update } from "./user-validation";
import User, { IUser } from "../../models/user/user.interface";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import Controller from "../../interfaces/controller.interface";

export default class UserController implements Controller {
  public path = "/usersaa";
  public router = express.Router();
  // public middleware: any[] = [AuthService.Instance.authenticate];

  private httpResWrapper: HttpResWrapper = HttpResWrapper.Instance;
  private userService: UserService = UserService.Instance;
  private authService: AuthService = AuthService.Instance;

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

  private initializeRoutes2() {
    this.router.get("/");
    this.router.get(
      "/:userId",
      getUser,
      AuthService.Instance.isAdmin,
      this.findById
    );
    this.router.put(
      "/:userId",
      update,
      AuthService.Instance.isAdmin,
      this.update
    );
    this.router.put("/", this.updateMe);
    this.router.post("/reset-password", this.resetPassword);
  }

  all = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { agencyId, withAdmin } = request.query;

      // let users: User[] = await this.userService.all(agencyId, withAdmin);
      // users.map(user => user.toJSON());
      // return this.httpResWrapper.success(response, users);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  };

  private handleErrors(response: Response, error: any) {
    console.error(error);
    this.httpResWrapper.error(response, error);
  }

  private async validateUserData(userData: any, response: Response) {
    const errors = await validate(userData);
    if (errors.length > 0) {
      this.httpResWrapper.handle(400, errors[0].constraints, response);
      return false;
    }
    return true;
  }

  private sendSuccessResponse(response: Response, data: any) {
    return this.httpResWrapper.success(
      response,
      data.toJSON ? data.toJSON() : data
    );
  }

  me = async (request: any, response: Response) => {
    const userId = request.user.userId;
    try {
      const user = await this.userService.findById(userId);
      this.sendSuccessResponse(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  findById = async (request: any, response: Response) => {
    const userId = request.params.userId;
    try {
      const user = await this.userService.findById(userId);
      this.sendSuccessResponse(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  create = async (
    request: any,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, userName, firstName, lastName, password } = request.body;
      console.log(request.body);

      // التحقق من وجود البريد الإلكتروني أو اسم المستخدم المسجل
      const checkEmail = await User.findOne({
        email: email.toLowerCase().trim(),
      });
      if (checkEmail) {
        return response.status(400).json({
          success: false,
          message: "البريد الإلكتروني مسجل بالفعل.",
        });
      }

      const checkUserName = await User.findOne({ userName: userName.trim() });
      if (checkUserName) {
        return response.status(400).json({
          success: false,
          message: "اسم المستخدم مسجل بالفعل.",
        });
      }

      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, 10);

      // إنشاء المستخدم وحفظه في قاعدة البيانات
      const newUser = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        userName: userName.trim(),
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      // إنشاء توكن (JWT)
      const token = JWT.sign(
        {
          email: savedUser.email,
          isAdmin: savedUser.isAdmin,
          id: savedUser._id,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      // إزالة كلمة السر من البيانات المرسلة
      const { password: _, ...userData } = savedUser.toObject();

      return response.status(201).json({
        success: true,
        message: `مرحباً ${savedUser.firstName} ${savedUser.lastName}، تم إنشاء حسابك بنجاح.`,
        data: userData,
        token,
      });
    } catch (err) {
      next(err); // تمرير الأخطاء إلى معالج الأخطاء
    }
  };

  update = async (request: any, response: Response) => {
    const { userId } = request.params;
    const user = { ...request.body, updatedBy: request.user?.userId };
    const isValid = await this.validateUserData(user, response);
    if (!isValid) return;

    try {
      const updatedUser = await this.userService.update(userId, user);
      this.sendSuccessResponse(response, updatedUser);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  updateMe = async (request: any, response: Response) => {
    const userId = request.user.userId;
    const user = { ...request.body, updatedBy: request.user?.userId };
    const isValid = await this.validateUserData(user, response);
    if (!isValid) return;

    try {
      const updatedUser = await this.userService.update(userId, user);
      this.sendSuccessResponse(response, updatedUser);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };

  resetPassword = async (request: Request, response: Response) => {
    const { new_password, old_password } = request.body;
    const userId = request.user.userId;
    try {
      const user = await this.userService.resetPassword(
        new_password,
        old_password,
        userId
      );
      this.sendSuccessResponse(response, user);
    } catch (error) {
      this.handleErrors(response, error);
    }
  };
}
