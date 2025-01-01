import { Login } from "../model/Login";
import { User } from "../model/User";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";
import { NotFoundError } from "../errorHandler/ErrorHandler";
import { PrismaClient, Role } from "@prisma/client";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    registerUser(userId: number, login: Login): Promise<User>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
}

export class UserService implements UserServiceInterface {

    private userRepository: UserRepository = new UserRepository();
    
    async createUser(user: UserDTO): Promise<User> {
        try{
            return await this.userRepository.createUser(new User(user));
        } catch (error: any) {
            throw new Error("Error trying to create an user!");
        }
    }

    async registerUser(userId: number, login: Login): Promise<User> {
        try {
            await this.getUserById(userId);
            return await this.userRepository.registerUser(userId, login);
        } catch (error : any) {
            throw new NotFoundError(`Error trying to registrate user with ID: ${userId}`);
        }
    }

    async getUserById(userId: number): Promise<User> {
        try {
            return await this.userRepository.getUserById(userId);
        } catch (error : any) {
            throw new NotFoundError(`User with ID: ${userId} not found!`);
        }
    }

    async getUserByEmail(userEmail: string): Promise<User> {
        try {
            const { id } = await (new PrismaClient()).login.findUniqueOrThrow( { where: { email: userEmail } } );
            return await this.userRepository.getUserByLogin(id);
        } catch (error : any) {
            throw new NotFoundError(`User with email: ${userEmail} don't have a login!`);
        }
    }

    async getUserByRole(userRole: Role): Promise<User[]> {
        try {
            return await this.userRepository.getUserByRole(userRole);
        } catch (error : any) {
            throw new NotFoundError(`No users with ${userRole} role found!`);
        }
    }
}