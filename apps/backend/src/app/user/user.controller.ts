import { Controller, Get, Param } from "@nestjs/common";

@Controller('user')
export class UserController{
    @Get('resources')
    async getResources(){
            
    }
    
    @Get('resources/:id')
    async getResourceReference(@Param('id') id:number){

    }





}