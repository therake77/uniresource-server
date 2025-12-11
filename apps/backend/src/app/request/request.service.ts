import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AuthService } from "../auth/auth.service";
import { Token } from "../models/common/token";
import { NewResourceDto } from "../models/common/newResourceDto";

@Injectable()
export class RequestService{
    constructor(
        private readonly databaseService:DatabaseService,
        private readonly authService:AuthService
    ){}

    async getRequestsOfUser(token:Token){

    }

    async requestUpload(new_rsrc:NewResourceDto, token:Token){

    }

    async requestUpdate(id:number,upd_rsrc:NewResourceDto,token:Token){

    }

    async requestDeletion(id:number,token:Token){

    }

    async requestCollaboration(token:Token){

    }

    //backdoor
    async directUploadResource(newResource:{date:Date;filename:string,extra:NewResourceDto}){
        console.log(newResource);
        await this.databaseService.saveResource(newResource);
    }

}