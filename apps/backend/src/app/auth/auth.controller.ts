import { Body, Controller, Post, UseGuards, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { LocalGuard } from "./guards/local.guard";
import { LoginDto } from "../models/dto/login.dto";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    @UsePipes(ValidationPipe)
    @UseGuards(LocalGuard)
    async login(@Request() req:any,@Body() logindto:LoginDto){
        return req.user;
    }

    @Post('register/user')
    @UsePipes(ValidationPipe)
    async createProfile(@Body() user:CreateUserDto){
        await this.authService.registerUser(user);
        return
    }



}