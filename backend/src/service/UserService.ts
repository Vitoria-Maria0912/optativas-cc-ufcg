import { PrismaClient, Role } from "@prisma/client";
import { User } from "../model/User";
import { Login } from "../model/Login";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";
import { validateAllCredentials } from "../util/util";
import { AuthenticationError, InvalidCredentialsError, NotFoundError } from "../errorHandler/ErrorHandler";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    registerUser(userId: number, emailLogin: string, passwordLogin: string): Promise<User>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
    getLoginByUserEmail(userEmail: string): Promise<Login>
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

    async registerUser(userId: number, emailLogin: string, passwordLogin: string): Promise<User> {
        try { 
            const prismaClient = new PrismaClient();
            const login = await prismaClient.login.findUnique({ where: { email: emailLogin } });

            if (login) { throw new AuthenticationError(`A user with email '${ emailLogin }' is already registered!`); }
            else { return await this.userRepository.registerUser(userId, emailLogin, passwordLogin); }
        }
        catch (error : any) { 
            if (error instanceof AuthenticationError) { throw new AuthenticationError(error.message); }
            else { throw new Error(`Error trying to register this user!`); }
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
        try { return await this.userRepository.getUserByRole(userRole); }
        catch (error : any) { throw new NotFoundError(`No users with '${ userRole } role' found!`); }
    }

    async getLoginByUserEmail(userEmail: string): Promise<Login> {
        try { return await this.userRepository.getLoginByUserEmail(userEmail); }
        catch (error : any) { throw new NotFoundError(`User with this email '${ userEmail }' don't have a login!`); }
    }
}