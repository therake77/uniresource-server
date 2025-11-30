import { Module } from "@nestjs/common";
import { AccessService } from "./access.service";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports:[AuthModule,DatabaseModule],
    providers:[AccessService]
})
export class AccessModule{}