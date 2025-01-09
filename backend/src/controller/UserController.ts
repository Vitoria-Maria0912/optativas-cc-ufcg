import { Request, Response } from 'express';
import { UserService } from "../service/UserService";
import { Role } from '@prisma/client';

export class UserController {

    private userService = new UserService();

    async createUser(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const user = request.body;
            const { name } = await this.userService.createUser(user);
            responseBody = { message: `User '${ name }' was created successfully!`, user};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to create an user!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

    async getUserById(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params
            const user = await this.userService.getUserById(Number(id))
            responseBody = { message: `User with ID '${ id }' was found successfully!`, user};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to create a user by ID!":  error.message};
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
            responseBody = { message: `User with email '${ email }' was found successfully!`, user};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get a user by email!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

    // Bug when the list of users is empty
    async getUserByRole(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { role } = request.params ;
            const users = await this.userService.getUserByRole(role as Role)
            responseBody = { message: `Users with '${ role }' role were found successfully!`, users};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get users by role!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

}