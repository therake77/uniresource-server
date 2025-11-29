import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { CreateLoginDto } from "./dto/createLogin.dto";
import { CreateUserDto } from "./dto/createUser.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    async login(@Body() login:CreateLoginDto){
        const jwt_token = this.authService.login(login.username,login.password)
        if(!jwt_token){
            throw UnauthorizedException
        }
        return jwt_token
    }

    @Post('register')
    async createNewUser(@Body() user:CreateUserDto){

    }


}