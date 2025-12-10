import { CreateUserDto } from "../dto/createUser.dto";
import { Permit } from "./permits";

//domain logic
export interface Person{
    id:number;
    permits:Permit;
    role:string;
}

export class User implements Person{
    public id:number;
    public username: string;
    public email:string;
    public permits:Permit;
    public role:string;
}



/*
export class Admin implements Person{
    public readonly id:number;
    public readonly permits:Permit;
    public readonly role:Role = Role.createAdminRole()

}

export class Colaborator extends User{
    override permits:Permit;
    override role:Role = Role.createColabRole()
}
*/

//serialized object(probably will be removed)
export class SerializedUser{

}