import { Role } from "@prisma/client";
import { User } from "../model/User";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";
import { InvalidCredentialsError, NotFoundError } from "../errorHandler/ErrorHandler";
import { validateCredentials } from "../util/util";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    registerUser(userId: number, email: string, password: string): Promise<User>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
}

export class UserService implements UserServiceInterface {

    private userRepository: UserRepository = new UserRepository();
    
    async createUser(user: UserDTO): Promise<User> {
        try { 
            const userToCreate = new User(user);
            await validateCredentials(userToCreate);
            return await this.userRepository.createUser(userToCreate); }
        catch (error: any) { 
            if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); }
            else { throw new Error("Error trying to create an user!"); }
        }
    }

    async registerUser(userId: number, email: string, password: string): Promise<User> {
        try { return await this.userRepository.registerUser(userId, email, password); }
        catch (error : any) { throw new NotFoundError(`Error trying to registrate user with ID: ${ userId }`); }
    }

    async getUserById(userId: number): Promise<User> {
        try { return await this.userRepository.getUserById(userId); }
        catch (error : any) { throw new NotFoundError(`User with ID: ${ userId } not found!`); }
    }

    async getUserByEmail(userEmail: string): Promise<User> {
        try { return await this.userRepository.getUserByEmail(userEmail); } 
        catch (error: any) { throw new NotFoundError(`User with email: ${ userEmail } not found!`); }
    }

    async getUserByRole(userRole: Role): Promise<User[]> {
        try { return await this.userRepository.getUserByRole(userRole); }
        catch (error : any) { throw new NotFoundError(`No users with '${ userRole }' role found!`); }
    }
}