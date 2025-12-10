import { Injectable, NotAcceptableException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../models/dto/login.dto";
import { Token } from "../models/common/token";
import { User } from "../models/common/user";
import { UserPermit } from "../models/common/permits";

@Injectable()
export class AuthService{
    constructor(
        private readonly databaseService:DatabaseService,
        private readonly jwtService:JwtService
    ){}

    async registerUser(userDto:CreateUserDto){
        const temp = await this.databaseService.findUserWithPassword(userDto.email,userDto.password,'USER');
        if(!temp){
            const newUserPermit:UserPermit = {
                canAccess : true,
                canDownload : true,
                canVisualize : true
            }
            await this.databaseService.saveUser(userDto,'USER',newUserPermit);
            return;
        }
        throw new NotAcceptableException("User already exists");
    }

    async createToken(login_info:LoginDto): Promise<String | null>{
        const user = await this.databaseService.findUserWithPassword(login_info.email,login_info.password,login_info.roleRequested);
        console.log(user);
        if(!user){
            return null;
        }
        return this.generateToken(user);
    }

    async getUser(payload: Token):Promise<User | null>{
        const user = this.databaseService.findUser(payload.userId,payload.role);
        return user;
    }
      
    private generateToken(user: User): String{
        return this.jwtService.sign({
            userId: user.id,
            username : user.email,
            role : user.role
        })
    }

}