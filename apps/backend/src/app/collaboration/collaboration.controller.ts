import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Token } from "../models/common/token";
import { NewResourceDto } from "../models/common/newResourceDto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AccessService } from "../access/access.service";
import { RequestService } from "../request/request.service";
import type { Request } from "express";

@Controller('colab')
export class CollaboratorController{

    constructor(
        private readonly accessService:AccessService,
        private readonly requestService:RequestService
    ){}

    @Get('myRequests')
    @UseGuards(JwtGuard)
    async getCollabRequests(@Req() req:{user : Token}){

    }

    @Post('upload')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async requestUploadResource(@Req() req:{user: Token}, @Body() newResourceDto: NewResourceDto){

    }

    @Put('update/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async requestUpdateResource(@Req() req:{user: Token}, @Body() toUpdateDto: NewResourceDto, @Param() id:number){

    }

    @Put('upload_backdoor')
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
    
    async directUpload(
        @Req() req: Request & {user: Token}, 
        @Body() newResourceDto: NewResourceDto,
        @UploadedFile() file:Express.Multer.File
    ){
        await this.requestService.directUploadResource({
            date: new Date((req as any).uploadDate),
            filename: file.filename,
            extra: newResourceDto
        }, req.user);
    }

    @Delete('delete/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async requestDeleteResource(@Req() req:{user: Token}, @Param() id:number ){

    }

    @Get('myResources')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async getResourcesOfCollab(@Req() req:{user: Token}){

    }

}