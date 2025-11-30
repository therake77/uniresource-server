import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AccessService{
    constructor(private readonly authService:AuthService){}
    
    async findResources(obj:any){

    }

    

}