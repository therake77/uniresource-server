import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { CreateLoginDto } from "../models/dto/login.dto";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    async login(@Body() login:CreateLoginDto){
        const jwt_token = await this.authService.login(login.username,login.password)
        if(!jwt_token){
            throw new HttpException('Wrong password or username',HttpStatus.UNAUTHORIZED)
        }
        return jwt_token
    }

    @Post('register/user')
    async createNewUser(@Body() user:CreateUserDto){
        this.authService.signin(user);
        return
    }



}