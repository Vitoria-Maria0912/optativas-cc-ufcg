import { Request, Response } from 'express';

export class AuthController {

    async createLogin(req: Request, res: Response) {
        const { email, password } = req.body;       
    }
} 