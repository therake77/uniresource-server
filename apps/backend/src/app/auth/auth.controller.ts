import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { LocalGuard } from "./guards/local.guard";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    @UseGuards(LocalGuard)
    async login(@Request() req:any){
        return req.user;
    }

    @Post('register/user')
    async createNewUser(@Body() user:CreateUserDto){
        this.authService.registerNewUser(user);
        return
    }



}