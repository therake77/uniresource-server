import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AccessModule } from "../access/access.module";
import { CollaboratorController } from "./collaboration.controller";

@Module({
    imports:[AuthModule,AccessModule],
    controllers:[CollaboratorController],
    providers:[]
})
export class CollaboratorModule{}