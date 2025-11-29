import { Permit } from "./permits";
import { Role } from "./roles";

//domain logic
export interface Actor{
    id:number;
    permits:Permit;
    role:Role;
}

export class User implements Actor{
    public readonly id:number;
    public readonly username: string;
    public readonly email:string;
    public readonly permits:Permit;
    public readonly role:Role = Role.createUserRole()

}

export class Admin implements Actor{
    public readonly id:number;
    public readonly permits:Permit;
    public readonly role:Role = Role.createAdminRole()

}

export class Colaborator extends User{
    override permits:Permit;
    override role:Role = Role.createColabRole()

}


//serialized object
export class SerializedUser{

}