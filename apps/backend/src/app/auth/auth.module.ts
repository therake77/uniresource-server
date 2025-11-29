import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../database/models/user";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "../database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { jwt_secret } from "./auth.constants";

@Module({
    imports:[TypeOrmModule.forFeature([User]),DatabaseModule,
        JwtModule.register({
            global:true,
            secret:jwt_secret.secret,
            signOptions:{
                expiresIn:'60s'
            }
        })],
    controllers:[AuthController],
    providers:[AuthService],
})
export class AuthModule{}