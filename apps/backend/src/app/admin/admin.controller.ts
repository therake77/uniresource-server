import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Token } from "../models/common/token";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController{

    constructor(
        private readonly adminService:AdminService
    ){}

    @Get('requests')
    async getRequests(@Req() req:{user:Token}){
        return await this.adminService.getRequests(req.user)
    }

    @Post('approve/:id')
    async approveRequest(@Req() req:{user: Token}, @Param('id') requestId:number){
        return await this.adminService.approveRequest(req.user,requestId);
    }

    @Post('deny/:id')
    async denyRequest(@Req() req:{user: Token}, @Param('id') requestId:number){
        return await this.adminService.denyRequest(req.user,requestId);
    }
    
}