import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Token } from "../models/common/token";
import { AuthService } from "../auth/auth.service";
import { AdminPermits } from "../models/common/permits";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class AdminService{
    constructor(
        private readonly authService:AuthService,
        private readonly databaseService:DatabaseService
    ){}

    async getRequests(token : Token){
        //first, check the user
        const admin = await this.authService.getUser(token);
        if(!admin){
            throw new NotFoundException("Cannot identify admin");
        }
        if(!((admin.permits) instanceof AdminPermits)){
            throw new UnauthorizedException("You are not an admin");
        } 
        //return the requests
        return await this.databaseService.getRequests();
    }

    async getRequest(token:Token, requestId:number){
        
    }

}