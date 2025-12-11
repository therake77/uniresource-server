import { Body, Controller, Get, Param, UseGuards, Request, NotFoundException, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { SearchResourceDto } from "../models/dto/searchResource";
import { AccessService } from "../access/access.service";

@Controller('user')
export class UserController{
    constructor(
        private readonly accessService:AccessService
    ){}

    @Get('resources')
    @UseGuards(JwtGuard)
    async getResources(){
        return "Imagine here are some resources";
    }
    
    @Get('resources/:id')
    @UseGuards(JwtGuard)
    async getResourceReference(@Param('id') id:number){
        return "Imagine a resource reference here";
    }

    @Get('search')
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async search(@Request() rq:any, @Body() searchDto:SearchResourceDto){
        console.log(searchDto);
        const result = await this.accessService.searchResource(searchDto)
        console.log(result)
        if(result.length === 0){
            throw new NotFoundException;
        }
        return result;
    }

}