import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { SearchResourceDto } from "../models/dto/searchResource";
import { DatabaseService } from "../database/database.service";
import { ResourceReference } from "../models/common/resource_ref";

@Injectable()
export class AccessService{
    constructor(
        private readonly authService:AuthService,
        private readonly databaseService:DatabaseService
    ){}
    
    async searchResource(searchResource:SearchResourceDto){
        return await this.databaseService.findResourceByCriteria(searchResource)
    }
    
    async getResourceReference(id:number,jwtPayload:{id:number,username:string}){
        //TODO(finish this)
        //const user = this.authService.getUser(jwtPayload.id);
        //const rsrcRef:ResourceReference = this.databaseService.buildReference(id)
    }

    async findResources(obj:any){

    }

    

}