import { Role } from "@prisma/client";
import { Login } from "./Login";
import { UserDTO } from "../dtos/UserDTO";
import { Discipline } from "./Discipline";

export interface UserInterface {
    id: number;
    role : Role;
    name : string;
    email : string;
    login? : Login;
    planning? : Discipline[]
}

export class User implements UserInterface {
    public id: number;
    public role: Role;
    public name: string;
    public email: string;
    public login?: Login;
    public planning?: Discipline[];

    constructor(userDTO : UserDTO) {
        this.id = userDTO.id;
        this.role = userDTO.role;
        this.name = userDTO.name;
        this.email = userDTO.email;
        this.login = userDTO.login;
        this.planning = userDTO.planning;
    }
}