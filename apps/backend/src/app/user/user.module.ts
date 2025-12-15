import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { AccessModule } from "../access/access.module";
import { RequestModule } from "../request/request.module";

@Module({
    imports:[AuthModule,AccessModule,RequestModule],
    controllers:[UserController],
    providers:[]
})
export class UserModule{}