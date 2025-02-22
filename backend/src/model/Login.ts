import { LoginDTO } from "../dtos/LoginDTO";

export interface LoginInterface {
    id : number;
    email : string;
    password : string;
}

export class Login implements LoginInterface {
    public id : number;
    public email : string;
    public password : string;

    constructor (loginDTO : LoginDTO) {
        this.id = loginDTO.id;
        this.email = loginDTO.email;
        this.password = loginDTO.password;
    }
}