import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { AccessModule } from "../access/access.module";
<<<<<<< HEAD

@Module({
    imports:[AuthModule,AccessModule],
=======
import { RequestModule } from "../request/request.module";

@Module({
    imports:[AuthModule,AccessModule,RequestModule],
>>>>>>> server
    controllers:[UserController],
    providers:[]
})
export class UserModule{}