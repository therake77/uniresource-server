import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports:[AuthModule,DatabaseModule],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule{}