import { Login } from "../model/Login";
import { User } from "../model/User";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    registerUser(userId: number, login: Login): Promise<User>;
}

export class UserService implements UserServiceInterface {

    private userRepository: UserRepository = new UserRepository();
    
    async createUser(user: UserDTO): Promise<User> {
        return await this.userRepository.createUser(new User(user));
    }

    async registerUser(userId: number, login: Login): Promise<User> {
        return await this.userRepository.registerUser(userId, login);
    }
}