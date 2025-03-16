import { Prisma, Role } from "@prisma/client";
import { User } from "../model/User";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";
import { validateAllCredentials } from "../util/util";
import { InvalidCredentialsError, NotFoundError, UserAlreadyExistsError } from "../errorHandler/ErrorHandler";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
    deleteOneUser(userId: number): Promise<void>;
    deleteAllUsers() : Promise<void>;
}

export class UserService implements UserServiceInterface {
    
    private userRepository: UserRepository = new UserRepository();
    
    async createUser(user: UserDTO): Promise<User> {
        try { 
            const userToCreate = new User(user);
            await validateAllCredentials(userToCreate);
            return await this.userRepository.createUser(userToCreate); }
        catch (error: any) { 
            if (error instanceof InvalidCredentialsError || error instanceof UserAlreadyExistsError) { throw error; }
            else { throw new Error("Error trying to create a user!"); }
        }
    }

    async getAllUsers(): Promise<User[]> { 
        const users = await this.userRepository.getAllUsers(); 
        if (users.length === 0) { throw new NotFoundError('No users found!'); }
        return users;
    }
        
    async getUserById(userId: number): Promise<User> {
        
        if (isNaN( userId )) { throw new InvalidCredentialsError("User ID must be a number!"); }

        try { return await this.userRepository.getUserById(userId); }
        catch (error : any) { 
            throw new NotFoundError(`User with ID '${ userId }' not found!`); }
    }
    
    async getUserByEmail(userEmail: string): Promise<User> {

        if (!userEmail) { throw new InvalidCredentialsError('Email is required!'); }

        else if (!userEmail.includes('@')) { throw new InvalidCredentialsError(`This email '${ userEmail }' is invalid, should be like 'name@example.com'!`); }
        
        try { return await this.userRepository.getUserByEmail(userEmail); } 
        catch (error: any) { throw new NotFoundError(`User with email '${ userEmail }' not found!`); }
    }
    
    async getUserByRole(userRole: Role): Promise<User[]> {

        const normalizedRole = userRole.toUpperCase() as Role;
                
        if (!Object.values(Role).includes(normalizedRole)) { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }
        
        try { const users = await this.userRepository.getUserByRole(normalizedRole);
            
            if (users.length === 0) { throw new NotFoundError(`No users with '${ normalizedRole }' role found!`); }
            
            else { return users; }
            
        } catch (error : any) {
            if (error instanceof InvalidCredentialsError || error instanceof NotFoundError) { throw error; }
            else { throw new Error("Error trying to get users by role!"); }
        }
    }

    async deleteOneUser(userId: number): Promise<void> {

        if ((await this.getAllUsers()).length === 0) { throw new NotFoundError('No users found!'); }
        if (isNaN( userId )) { throw new InvalidCredentialsError("User ID must be a number!"); }

        try { await this.userRepository.deleteOneUser(userId); }
        catch (error : any) { throw new NotFoundError(`User with ID '${ userId }' not found!`); }         
    }

    async deleteAllUsers(): Promise<void> {
        if ((await this.getAllUsers()).length === 0) {
            throw new NotFoundError('No users found!');
        }
        await this.userRepository.deleteAllUsers();    
    }
}