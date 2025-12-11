import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AccessModule } from "../access/access.module";
import { CollaboratorController } from "./collaboration.controller";
import { RequestModule } from "../request/request.module";

@Module({
    imports:[AuthModule,AccessModule,RequestModule],
    controllers:[CollaboratorController],
    providers:[]
})
export class CollaboratorModule{}