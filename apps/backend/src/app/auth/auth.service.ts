import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class AuthService{
    constructor(
        private readonly databaseService:DatabaseService
    ){}

    
    async login(username:string,password:string){
        const user = await this.databaseService.findUserWithPassword(username,password)
        if(!user){
            return null
        }
        

    }
    async signIn(username:string,email:string,password:string){

    }
}