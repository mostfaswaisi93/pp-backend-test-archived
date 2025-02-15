import { Request, Response } from "express";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      // Logic for login
      // Send a response instead of returning the Response object
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      // Logic for registering the user
      // Send a response instead of returning the Response object
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
