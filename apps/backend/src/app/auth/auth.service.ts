import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { Role } from "../models/common/roles";
import { UserPermit } from "../models/common/permits";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{
    constructor(
        private readonly databaseService:DatabaseService,
        private readonly jwtService:JwtService
    ){}

    
    async validateUser(username:string,password:string){
        const user = await this.databaseService.findUserWithPassword(username,password)
        if(!user){
            return null
        }
        const jwtToken = this.jwtService.sign({
            sub: user.id,
            username: user.username,
        })
        return jwtToken;
    }

    async getUser(id:number){
        const user = await this.databaseService.findUserById(id);
        return user
    }

    async registerNewUser(newUser:CreateUserDto){
        const userRole = Role.createUserRole()
        const userPermit = new UserPermit()
        this.databaseService.saveUser(newUser,userRole,userPermit);
        return
    }
}