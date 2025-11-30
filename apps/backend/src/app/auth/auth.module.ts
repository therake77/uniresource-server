import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "../database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LocalGuard } from "./guards/local.guard";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtGuard } from "./guards/jwt.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports:[ConfigModule,DatabaseModule,
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async (config:ConfigService) => ({
                global:true,
                secret: config.get<string>('JWT_SECRET_KEY'),
                signOptions:{
                    expiresIn:'1h'
                }
            })
            
        })
    ],
    controllers:[AuthController],
    providers:[AuthService,LocalGuard,LocalStrategy,JwtGuard,JwtStrategy],
    exports:[AuthService,JwtGuard]
})
export class AuthModule{}