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
// -- verify ternary to return the correct error message
            responseBody = { message: (!error.message) ? "Error trying to create an user!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

    async registerUser(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { userId, login } = request.body;
            await this.userService.registerUser(userId, login);
            responseBody = { message: "User registered successfully!", login};
            codeResponse = 201;
        } catch (error: any) {
// -- verify ternary to return the correct error message
            responseBody = { message: (!error.message) ? "Error trying to register an user!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }
}