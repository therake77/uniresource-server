import { Body, Controller, Get, Param, UseGuards, UsePipes, ValidationPipe, Post, Req, Res } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { SearchResourceDto } from "../models/dto/searchResource";
import { Token } from "../models/common/token";
import { AccessService } from "../access/access.service";
import type { Response } from "express";

@Controller('user')
export class UserController{

    constructor(
        private readonly accessService:AccessService
    ){}

    @Get('resource/:id')
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async getResourceAsImages(@Req() req : { user: Token },@Param('id') id: number){
        const token:Token = req.user;
        console.log(token);
        return "Imagine here are some resources";
    }
    
    @Get('download/:id')
    @UseGuards(JwtGuard)
    async downloadResource(@Req() req: { user: Token }, @Param('id') id:number, @Res() res:Response){
        const stream = await this.accessService.downloadResources(id,req.user);
        stream.pipe(res);
    }

    @Get('search')
    @UseGuards(JwtGuard)
    async search(@Req() req: { user: Token }, @Body() searchDto:SearchResourceDto){
        return await this.accessService.searchResource(searchDto);
    }

    @Post('request')
    @UseGuards(JwtGuard)
    async requestCollaboration(@Req() req: { user: Token }){

    }

    @Get('rsrc_ref/:id')
    @UseGuards(JwtGuard)
    async getResourceReference(@Req() req: { user: Token }, @Param('id') id:number){
        return await this.accessService.createResourceReference(id,req.user);
    }
}