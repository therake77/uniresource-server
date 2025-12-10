import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator'

export const roles = ['USER','COLLABORATOR','ADMIN']

export class LoginDto{
    
    @IsNotEmpty()
    @IsEmail()
    email:string;
    
    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    @Transform(({value}) => typeof value == 'string' ? value.toUpperCase() : value)
    @IsIn(roles)
    roleRequested:string;
}