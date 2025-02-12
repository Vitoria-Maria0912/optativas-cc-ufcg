import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { UserService } from '../service/UserService';

export class AuthController {

    private userService = new UserService();
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

    async getTokenByUserEmail(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { email, password } = request.body;
            const user = await this.userService.getUserByEmail(email);
            const login = await this.authService.getTokenByUserEmail(user, password)
            responseBody = { message: `Login for user '${ email }' was found successfully!`, login};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get a login by user email!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }
} 
