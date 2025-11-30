import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly config:ConfigService){
        const key = config.get<string>('JWT_SECRET_KEY')
        if(!key){
            throw Error("No key found")
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: key
        });
    }

    override validate(payload:any){
        return payload
    }

}