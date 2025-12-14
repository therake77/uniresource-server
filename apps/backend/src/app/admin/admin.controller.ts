import { Controller, Get, Req } from "@nestjs/common";
import { Token } from "../models/common/token";
import type { Request } from "express";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController{

    constructor(
        private readonly adminService:AdminService
    ){}

    @Get('requests')
    async getRequests(@Req() req:Request & {user:Token}){
        return await this.adminService.getRequests(req.user)
    }
}