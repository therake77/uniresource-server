import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { RequestService } from "./request.service";

@Module({
    imports:[AuthModule,DatabaseModule],
    providers:[RequestService],
    controllers:[],
    exports:[RequestService]
})
export class RequestModule{}