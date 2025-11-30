import { Module } from "@nestjs/common";
import { AccessService } from "./access.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports:[AuthModule],
    providers:[AccessService]
})
export class AccessModule{}