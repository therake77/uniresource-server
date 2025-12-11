import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { AccessModule } from "../access/access.module";

@Module({
    imports:[AuthModule,AccessModule],
    controllers:[UserController],
    providers:[]
})
export class UserModule{}