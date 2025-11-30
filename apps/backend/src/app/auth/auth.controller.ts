import { Body, Controller, Post, UseGuards, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { LocalGuard } from "./guards/local.guard";
import { CreateLoginDto } from "../models/dto/login.dto";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    @UsePipes(ValidationPipe)
    @UseGuards(LocalGuard)
    async login(@Request() req:any,@Body() logindto:CreateLoginDto){
        return req.user;
    }

    @Post('register/user')
    @UsePipes(ValidationPipe)
    async createNewUser(@Body() user:CreateUserDto){
        this.authService.registerNewUser(user);
        return
    }



}