import { Module } from "@nestjs/common";
import { AuthController } from "../auth/auth.controller";
import { DatabaseModule } from "../database/database.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
    imports:[AuthController,DatabaseModule],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule{}