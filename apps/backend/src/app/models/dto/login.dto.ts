import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator'
import { Role } from '../common/roles';

export class LoginDto{
    
    @IsNotEmpty()
    @IsEmail()
    email:string;
    
    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    @Transform(({value}) => typeof value == 'string' ? value.toUpperCase() : value)
    @IsIn([Role.USER,Role.COLLAB,Role.ADMIN])
    roleRequested:string;
}