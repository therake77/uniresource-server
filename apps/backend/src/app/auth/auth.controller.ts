import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { LocalGuard } from "./guards/local.guard";
import { LoginDto } from "../models/dto/login.dto";
import type { Request } from "express";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    @UsePipes(ValidationPipe)
    @UseGuards(LocalGuard)
    async login(@Req() req:Request,@Body() logindto:LoginDto){
        console.log(req.user);
        return req.user;
    }

    @Post('register')
    @UsePipes(ValidationPipe)
    async createProfile(@Body() user:CreateUserDto){
        await this.authService.registerUser(user);
        return
    }



}