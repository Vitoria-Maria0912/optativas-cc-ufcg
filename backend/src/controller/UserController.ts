import { Request, Response } from 'express';
import { UserService } from "../service/UserService";

export class UserController {

    private userService = new UserService();

    async createUser(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const user = request.body;
            await this.userService.createUser(user);
            responseBody = { message: "User created successfully!", user};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to create an user!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

    async getUserByEmail(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { email } = request.params;
            const user = await this.userService.getUserByEmail(email);
            responseBody = { message: "User was found successfully!", user};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get an user by email!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }
}