import { Role } from "@prisma/client";
import { Login } from "./Login";
import { UserDTO } from "../dtos/UserDTO";
import { Planning } from "./Planning";

export interface UserInterface {
    id: number;
    role : Role;
    name : string;
    email : string;
    plannings?: Planning[];
}

export class User implements UserInterface {
    public id: number;
    public role: Role;
    public name: string;
    public email: string;
    public plannings?: Planning[];

    constructor(userDTO : UserDTO) {
        this.id = userDTO.id;
        this.role = userDTO.role;
        this.name = userDTO.name;
        this.email = userDTO.email;
        this.plannings = userDTO.plannings;
    }
}