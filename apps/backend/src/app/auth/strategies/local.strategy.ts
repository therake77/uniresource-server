import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../../models/dto/login.dto";
import { Request } from "express";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    
    constructor(private authService:AuthService){
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        });
    }

    override async validate(req: Request, email: string, password: string) {
        const loginDto = req.body as LoginDto;
        console.log(loginDto);
        const token = await this.authService.createToken(loginDto);
        if(!token){
            throw new UnauthorizedException();
        }
        return token;
    }

}