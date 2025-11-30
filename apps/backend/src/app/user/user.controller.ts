import { Body, Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { SearchDto } from "../models/dto/search.dto";

@Controller('user')
export class UserController{
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

    @Get('resources/search')
    @UseGuards(JwtGuard)
    async search(@Request() rq:any, @Body() searchDto:SearchDto){
        return "Imagine a list of resources here";
    }

    

}