import { Router, RequestHandler, ErrorRequestHandler } from "express";

interface Controller {
  path: string;
  router: Router;
  middleware?: (RequestHandler | ErrorRequestHandler)[];
}

export default Controller;
