import { NextFunction, Request, Response } from "express";
import { User } from "../../database/entity/User";
import Controller from '../../interfaces/controller.interface';
import * as express from 'express';
import * as passport from 'passport';
import HttpResWrapper from "../../commons/http-response/http-res-wrapper";
import AuthService from "./auth-service";
import * as i18n from 'i18n';
import { validate } from "class-validator";
import { UserService } from "../user/user-service";
import AccessTokenService from "./access-token-service";
import { use } from "passport";
import { login, forgetPassword, resetPassword } from "./auth-validation";

export default class AuthController implements Controller {

  public path = '/auth';
  public router = express.Router();
  public middleware: any[] = [];


  private httpResWrapper: HttpResWrapper = new HttpResWrapper();
  private authService = AuthService.Instance;
  private accessTokenServce = AccessTokenService.Instance;
  private userService: UserService = UserService.Instance;

  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', login, this.login);
    this.router.post('/me', this.authService.authenticate, this.me);
    this.router.get('/generateCaptcha', this.generateCaptcha);
    this.router.post('/forget-password', forgetPassword, this.forgetPassword);
    this.router.post('/reset-password', resetPassword, this.resetPassword);
    this.router.delete('/', this.authService.authenticate, this.logout);
  }

  login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    try {
      let user = await this.authService.login(email, password);
      this.httpResWrapper.success(res, user);
    } catch (error) {
      this.httpResWrapper.error(res, error);
    }
  };

  me = async (request, response) => {
    let userId = request.user.userId;
    try {
      let user = await this.userService.findById(userId);
      return this.httpResWrapper.success(response, user.toJSON());
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  }

  logout = async (req, res) => {
    let token = req.user.token;
    try {
      await this.authService.logout(token);
      this.httpResWrapper.success(res);
    } catch (error) {
      this.httpResWrapper.error(res, error);
    }
  };

  forgetPassword = async (request, response) => {
    let email = request.body.email;
    try {
      let result = await this.authService.forgetPassword(email);
      return this.httpResWrapper.success(response, result);
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  }

  resetPassword = async (request, response) => {
    let password = request.body.password;
    let verificationToken = request.body.verificationToken;
    try {
      let user = await this.authService.resetPassword(verificationToken, password);
      return this.httpResWrapper.success(response, user.toJSON());
    } catch (error) {
      this.httpResWrapper.error(response, error);
    }
  }

  generateCaptcha = async (req, res) => {
    try {
      let captcha = await this.authService.generateCaptcha();
      this.httpResWrapper.success(res, captcha);
    } catch (error) {
      this.httpResWrapper.error(res, error);
    }
  };

}