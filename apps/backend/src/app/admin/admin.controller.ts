import { Controller, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Token } from "../models/common/token";
import { AdminService } from "./admin.service";
import { JwtGuard } from "../auth/guards/jwt.guard";

@Controller('admin')
export class AdminController{

    constructor(
        private readonly adminService:AdminService
    ){}

    @Get('requests')
    @UseGuards(JwtGuard)
    async getRequests(@Req() req:{user:Token}){
        return await this.adminService.getRequests(req.user)
    }

    @Post('approve/:id')
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async approveRequest(@Req() req:{user: Token}, @Param('id') requestId:number){
        console.log(requestId)
        return await this.adminService.approveRequest(req.user,requestId);
    }
    
    @Post('deny/:id')
    @UseGuards(JwtGuard)
    async denyRequest(@Req() req:{user: Token}, @Param('id') requestId:number){
        return await this.adminService.denyRequest(req.user,requestId);
    }
    
}