import { Login, Role } from "@prisma/client";
import { AdministratorDTO } from "../dtos/AdministratorDTO";

export interface AdministratorInterface {
    id: number;
    role : Role;
    name : string;
    login : Login;
}

export class Administrator implements AdministratorInterface {
    public id: number;
    public role: Role;
    public name: string;
    public login: Login;

    constructor(administratorDTO : AdministratorDTO) {
        this.id = administratorDTO.id;
        this.role = administratorDTO.role;
        this.name = administratorDTO.name;
        this.login = administratorDTO.login;
    }
}