import { NextFunction, Request, Response } from "express";
import { User } from "../../database/entity/User";
import Controller from '../../interfaces/controller.interface';
import * as express from 'express';
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import { UserService } from "./UserService";
import { validate } from "class-validator";
import AuthService from "../auth/auth-service";
import UploadService from "../../commons/libs/UploadService";
import * as cors from "cors";
import { InvalidInputException } from "../../commons/errors/exceptions";
import { getUser, create, update, updateActive } from "./UserValidation";

export default class UserController implements Controller {

    public path = '/users';
    public router = express.Router();
    public middleware: any[] = [AuthService.Instance.authenticate];


    private httpResWrapper: HttpResWrapper = new HttpResWrapper();
    private userService: UserService = UserService.Instance;
    private authService: AuthService = AuthService.Instance;
    private static _instance;

    static get Instance() {
        return this._instance ? this._instance : (this._instance = new this());
    }

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', AuthService.Instance.isAdmin, this.all);
        this.router.get('/active', AuthService.Instance.isAdmin, this.active);
        this.router.get('/ncsi', AuthService.Instance.isAdmin, this.ncsi);
        this.router.post('/', create, AuthService.Instance.isAdmin, this.create);
        this.router.post('/reset-password', this.resetPassword);
        this.router.get('/:userId', getUser, AuthService.Instance.isAdmin, this.findById);
        this.router.put('/:userId', update, AuthService.Instance.isAdmin, this.update);
        this.router.put('/active/:userId', updateActive, AuthService.Instance.isAdmin, this.updateActive);
        this.router.put('/', this.updateMe);
    }

    all = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { agencyId, withAdmin } = request.query;
            
            let users: User[] = await this.userService.all(agencyId, withAdmin);
            users.map(user => user.toJSON());
            return this.httpResWrapper.success(response, users);
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }

    active = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { agencyId } = request.query;

            let users: User[] = await this.userService.active(agencyId);
            users.map(user => user.toJSON());
            return this.httpResWrapper.success(response, users);
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }

    ncsi = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let users: User[] = await this.userService.ncsi();
            users.map(user => user.toJSON());
            return this.httpResWrapper.success(response, users);
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }

    me = async (request: any, response: Response, next: NextFunction) => {
        let userId = request.user.userId;
        try {
            let user: User = await this.userService.findById(userId);
            return this.httpResWrapper.success(response, user.toJSON());
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }

    findById = async (request: any, response: Response, next: NextFunction) => {
        let userId = request.params.userId;
        try {
            let user: User = await this.userService.findById(userId);
            return this.httpResWrapper.success(response, user.toJSON());
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }


    create = async (request: Request, response: Response, next: NextFunction) => {

        let user = new User();

        user.agency = request.body.agency;
        user.nameAr = request.body.nameAr;
        user.nameEn = request.body.nameEn;
        user.phone = request.body.phone;
        user.title = request.body.title;
        user.userType = request.body.userType;
        user.email = request.body.email;
        user.password = request.body.password;
        user.department = request.body.department;
        user.directorGeneral = request.body.directorGeneral;
        user.active = request.body.active === undefined ? 1 : request.body.active;
        user.updatedBy = (request.user as Partial<User>).userId;
        user.deactivateDate = request.body.deactivateDate;

        validate(user).then(async errors => {
            if (errors.length > 0) {
                this.httpResWrapper.handle(400, errors[0].constraints, response);
            } else {
                try {
                    let createdUser: User = await this.userService.create(user);
                    return this.httpResWrapper.success(response, createdUser.toJSON());
                } catch (error) {
                    return this.httpResWrapper.error(response, error);
                }
            }
        })
    }

    update = async (request: any, response: Response, next: NextFunction) => {

        const { userId } = request.params;

        let user = new User();

        user.agency = request.body.agency;
        user.nameAr = request.body.nameAr;
        user.nameEn = request.body.nameEn;
        user.phone = request.body.phone;
        user.title = request.body.title;
        user.department = request.body.department;
        user.directorGeneral = request.body.directorGeneral;
        user.userType = request.body.userType;
        user.email = request.body.email;
        if (user.password) {
            user.password = request.body.password;
        }
        user.active = request.body.active === undefined ? 1 : request.body.active;
        user.updatedBy = (request.user as Partial<User>).userId;

        validate(user).then(async errors => {
            if (errors.length > 0) {
                this.httpResWrapper.handle(400, errors[0].constraints, response);
            } else {
                try {
                    let updatedUser = await this.userService.update(userId, user);
                    return this.httpResWrapper.success(response, updatedUser);
                } catch (error) {
                    this.httpResWrapper.error(response, error);
                }
            }
        })
    }

    updateMe = async (request: any, response: Response, next: NextFunction) => {

        let userId = request.user.userId;

        let user = new User();

        user.agency = request.body.agency;
        user.nameAr = request.body.nameAr;
        user.nameEn = request.body.nameEn;
        user.phone = request.body.phone;
        user.title = request.body.title;
        if (user.password) {
            user.password = request.body.password;
        }
        user.updatedBy = (request.user as Partial<User>).userId;

        validate(user).then(async errors => {
            if (errors.length > 0) {
                this.httpResWrapper.handle(400, errors[0].constraints, response);
            } else {
                try {
                    let updatedUser = await this.userService.update(userId, user);
                    return this.httpResWrapper.success(response, updatedUser);
                } catch (error) {
                    this.httpResWrapper.error(response, error);
                }
            }
        })
    }

    resetPassword = async (request, response) => {
        let new_password = request.body.new_password;
        let old_password = request.body.old_password;
        let userId = request.user.userId;

        try {
            let user = await this.userService.resetPassword(new_password, old_password, userId);
            return this.httpResWrapper.success(response, user.toJSON());
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }

    updateActive = async (request: Request, response: Response, next: NextFunction) => {
        const { userId } = request.params;
        const { active } = request.body;
        const updateBy = (request.user as Partial<User>).userId;

        try {
            let user = await this.userService.updateActive(userId, active, updateBy);
            return this.httpResWrapper.success(response, user);
        } catch (error) {
            this.httpResWrapper.error(response, error);
        }
    }

}