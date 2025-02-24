import { Router } from "express";

interface Controller {
  path: string;
  router: Router;
  middleware?: any[];
}

export default Controller;
