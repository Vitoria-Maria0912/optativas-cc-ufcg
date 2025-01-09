import { Role } from "@prisma/client";
import { User } from "../model/User";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";
import { validateAllCredentials } from "../util/util";
import { InvalidCredentialsError, NotFoundError } from "../errorHandler/ErrorHandler";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
}

export class UserService implements UserServiceInterface {

    private userRepository: UserRepository = new UserRepository();
    
    async createUser(user: UserDTO): Promise<User> {
        try { 
            const userToCreate = new User(user);
            await validateAllCredentials(userToCreate);
            return await this.userRepository.createUser(userToCreate); }
        catch (error: any) { 
            if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); }
            else { throw new Error("Error trying to create a user!"); }
        }
    }
    
    async getUserById(userId: number): Promise<User> {
        try { return await this.userRepository.getUserById(userId); }
        catch (error : any) { throw new NotFoundError(`User with ID '${ userId }' not found!`); }
    }

    async getUserByEmail(userEmail: string): Promise<User> {
        try { return await this.userRepository.getUserByEmail(userEmail); } 
        catch (error: any) { throw new NotFoundError(`User with email '${ userEmail }' not found!`); }
    }

    async getUserByRole(userRole: Role): Promise<User[]> {
        try { 
            const users = await this.userRepository.getUserByRole(userRole);
            if (users.length === 0) { throw new NotFoundError(`No users with '${ userRole }' role found!`); }
            else { return await this.userRepository.getUserByRole(userRole); }
        } catch (error : any) { 
            if (error instanceof NotFoundError) { throw new NotFoundError(error.message); } 
            else { throw new Error("Error trying to get users by role!"); }
        }
    }
}