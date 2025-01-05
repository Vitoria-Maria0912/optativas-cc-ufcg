import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';

export class AuthController {

    private authService = new AuthService();

    async createLogin(request: Request, response: Response) {
        var codeResponse: number;
        var responseBody: object;

        try {
            const { email, password } = request.body; 
            const token = await this.authService.createLogin(email, password);
            responseBody = { message: `User '${ email }' registered successfully!`, token: token };
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to register an user!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }
} 
