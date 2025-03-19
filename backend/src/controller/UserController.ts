import { Request, Response } from 'express';
import { UserService } from "../service/UserService";
import { Role } from '@prisma/client';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export class UserController {

    private userService = new UserService();

    async createUser(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const user = { ...request.body, role: request.body.role ?? "COMMON" }
            const { name } = await this.userService.createUser(user);
            responseBody = { message: `User '${ name }' was created successfully!`, user };
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
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to create a user by ID!": error.message};
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
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get a user by email!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

    async getUserByRole(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { role } = request.params ;
            const users = await this.userService.getUserByRole(role as Role)
            responseBody = { message: `Users with '${ role }' role were found successfully!`, users};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get users by role!":  error.message};
            codeResponse = (error.statusCode && !isNaN(error.statusCode)) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody);
    }

    async getAllUsers(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;

        let page = parseInt(request.query.page as string) || 1;
        let limit = parseInt(request.query.limit as string) || 10;
        
        page = Math.max(page, 1);
        limit = Math.max(limit, 1);
        
        const offset = (page - 1) * limit;
        try {
            const { users, total } = await this.userService.getAllUsers(offset, limit);
            responseBody = { message: "Users were found successfully!", users, total};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get all users!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async patchUser(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params;
            const updates = request.body;
            await this.userService.patchUser(Number(id), updates);
            const user = await this.userService.getUserById(Number(id));
            responseBody = { message: `User with ID '${ id }' was updated successfully!`, user};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to update a user's field!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async deleteOneUser(request: Request, response: Response): Promise<Response> {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params ;
            await this.userService.deleteOneUser(Number(id));
            responseBody = { message: `User with ID '${ id }' was deleted successfully!` };
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to delete user by id!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async deleteAllUsers(request: Request, response: Response): Promise<Response> {
        var codeResponse: number;
        var responseBody: object;
        try {
            await this.userService.deleteAllUsers();
            responseBody = { message: "All users were deleted successfully!"};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to delete all users!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }
}