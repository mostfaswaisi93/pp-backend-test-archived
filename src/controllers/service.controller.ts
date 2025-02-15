import { Request, Response, NextFunction } from "express";
import Service from "../models/service.model";
import CacheService from "../utils/cacheService";

class ServiceController {
  async getAllServices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cacheKey = "services";
      const cachedData = await CacheService.getCache(cacheKey);

      if (cachedData) {
        console.log("🟢 Data from Redis Cache");
        res.status(200).json(cachedData);
        return;
      }

      const services = await Service.find();
      await CacheService.setCache(cacheKey, services);

      res.status(200).json(services);
    } catch (error) {
      next(error); // تمرير الخطأ إلى Express Middleware
    }
  }
}

export default new ServiceController();
