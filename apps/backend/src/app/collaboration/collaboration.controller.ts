import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Token } from "../models/common/token";
import { NewResourceDto } from "../models/common/newResourceDto";

@Controller('colab')
export class CollaboratorController{
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