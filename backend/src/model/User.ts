import { Role } from "@prisma/client";
import { Login } from "./Login";
import { UserDTO } from "../dtos/UserDTO";

export interface UserInterface {
    id: number;
    role : Role;
    name : string;
    email : string;
    password? : string;
    login? : Login;
}

export class User implements UserInterface {
    public id: number;
    public role: Role;
    public name: string;
    public email: string;
    public password?: string;
    public login?: Login;

    constructor(userDTO : UserDTO) {
        this.id = userDTO.id;
        this.role = userDTO.role;
        this.name = userDTO.name;
        this.email = userDTO.email;
        this.password = userDTO.password;
        this.login = userDTO.login;
    }
}