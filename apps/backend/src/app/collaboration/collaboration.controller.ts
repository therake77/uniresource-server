import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Token } from "../models/common/token";
import { NewResourceDto } from "../models/common/newResourceDto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AccessService } from "../access/access.service";
import { RequestService } from "../request/request.service";
import type { Request } from "express";
import { Role } from "../models/common/roles";

@Controller('collab')
export class CollaboratorController{

    constructor(
        private readonly accessService:AccessService,
        private readonly requestService:RequestService
    ){}

    @Get('myRequests')
    @UseGuards(JwtGuard)
    async getCollabRequests(@Req() req:{user : Token}){
        if(req.user.role != Role.COLLAB){
            throw new UnauthorizedException("You are not a collaborator");
        }
        return this.requestService.getRequestsOfUser(req.user);
    }

    @Post('upload')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './storage/temp',
            filename: (req:Request,file,cb) => {
                const timestamp = Date.now();
                (req as any)['uploadDate'] = timestamp;
                const dateString = timestamp + '-' + Math.round(Math.random() * 1e9);
                cb(null,dateString + '-' + file.originalname);
            }
        })
    }))
    async requestUploadResource(
        @Req() req:{user: Token},
        @Body() newResourceDto: NewResourceDto,
        @UploadedFile() file:Express.Multer.File
    ){
        if(req.user.role != Role.COLLAB){
            throw new UnauthorizedException("You are not a collaborator");
        }
        const uploadDate = new Date((req as any).uploadDate);
        const filename = file.filename;

        return await this.requestService.requestUpload(uploadDate,filename,newResourceDto,req.user);
    }

    @Put('update/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './storage/temp',
            filename: (req:Request,file,cb) => {
                const timestamp = Date.now();
                (req as any)['uploadDate'] = timestamp;
                const dateString = timestamp + '-' + Math.round(Math.random() * 1e9);
                cb(null,dateString + '-' + file.originalname);
            }
        })
    }))
    async requestUpdateResource(
        @Req() req:{user: Token}, 
        @Body() toUpdateDto: NewResourceDto, 
        @Param('id') id:number,
        @UploadedFile() file:Express.Multer.File
    ){
        if(req.user.role != Role.COLLAB){
            throw new UnauthorizedException("You are not a collaborator");
        }
        const uploadDate = new Date((req as any).uploadDate);
        const filename = file.filename;

        return await this.requestService.requestUpdate(uploadDate,filename,toUpdateDto,id,req.user);
    }

    @Delete('delete/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async requestDeleteResource(@Req() req:{user: Token}, @Param('id') id:number ){
        if(req.user.role != Role.COLLAB){
            throw new UnauthorizedException("You are not a collaborator");
        }
        return await this.requestService.requestDeletion(id,req.user);
    }

    @Get('myResources')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async getResourcesOfCollab(@Req() req:{user: Token}){
        if(req.user.role != Role.COLLAB){
            throw new UnauthorizedException("You are not a collaborator");
        }
        return await this.accessService.getResourcesByResponsible(req.user);
    }

}